var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var momentTimezone = require('moment-timezone');
var pushNotifications = require('../lib/pushNotifications');

var notificationSchema = mongoose.Schema({
  user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, '"user" ID is required']
	},

	stopPointId: {
		type: String,
		required: [true, '"stopPointId" is required']
	},
	lineNumber: {
		type: Number,
		required: [true, '"lineNumber" is required']
	},

	periodStart: {
		type: String,
		required: [true, '"periodStart" is required']
	},
	periodEnd: {
		type: String,
		required: [true, '"periodEnd" is required']
	},
	activeDays: {
		type: [Number],
		required: [true, '"activeDays" array is required']
	},
	arrivalThreshold: {
		type: Number,
		required: [true, '"arrivalThreshold" (seconds) is required']
	},

	publishThreshold: {
		type: Number,
		required: [true, '"threshold" (seconds) is required']
	},
	lastPublishedAt: {
		type: Date,
		default: null
	}
}, {
	minimize: false,
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}
});

notificationSchema.statics.setPropsAndSave = function* (NotificationObj) {
	NotificationObj.user = this.User._id;

	NotificationObj.lineNumber = this.request.body.lineNumber;
	NotificationObj.stopPointId = this.request.body.stopPointId;

	NotificationObj.periodStart = this.request.body.periodStart;
	NotificationObj.periodEnd = this.request.body.periodEnd;
	NotificationObj.activeDays = this.request.body.activeDays;
	NotificationObj.arrivalThreshold = this.request.body.arrivalThreshold;

	NotificationObj.publishThreshold = this.request.body.publishThreshold;
	NotificationObj.lastPublishedAt = null;

	yield NotificationObj.save();
};

notificationSchema.statics.getActiveNotifications = function* () {
	var currentDate = new Date();
	var currentHour = currentDate.getHours();
	var currentMin = currentDate.getMinutes();
	var currentDayOfWeek = currentDate.getDay();

	return yield this.find({
		periodStart: {
			$lte: currentHour + ':' + currentMin + ':00'
		},
		periodEnd: {
			$gt: currentHour + ':' + currentMin + ':00'
		},
		activeDays: currentDayOfWeek
	})
};

notificationSchema.methods.shouldPublishToQueue = function() {
	var shouldPublishToQueue = false;

	if (this.lastPublishedAt === null) {
		shouldPublishToQueue = true;
	}
	else {
		var currentMicrotime = (new Date()).getTime();
		var lastPublishedAtMicrotime = (new Date(this.lastPublishedAt)).getTime();
		var publishThreshold = this.publishThreshold * 1000;

		if (currentMicrotime > (lastPublishedAtMicrotime + publishThreshold)) {
			shouldPublishToQueue = true;
		}
	}

	if (shouldPublishToQueue === true) {
		this.lastPublishedAt = new Date();
		this.save();
	}

	return shouldPublishToQueue;
};

notificationSchema.methods.pushToDevice = function* (nextArrival) {
	try {
		var arrivalDate = moment(nextArrival.expectedArrival).tz('Europe/London');
		var arrivalTime = arrivalDate.format('HH:mm:ss');

		var msg = 'Bus ' + nextArrival.lineNumber + ' (stop ' + nextArrival.stopPointLetter + ') arriving at ' + arrivalTime;

		yield pushNotifications.sendMessage(msg, this.user.devices);
	}
	catch (e) {
		throw e;
	}
};

module.exports = mongoose.model('Notification', notificationSchema);
