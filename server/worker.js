var co = require('co');
var nconf = require('nconf');
var mongoose = require('mongoose');
var amqp = require('./lib/amqp');
var tflbus = require('./lib/tflbus');

require ('./models');
require('./lib/nconf')();
require('./lib/mongoose')();

var Notification = mongoose.model('Notification');
var Arrival = require('./models/arrival');

co(function* () {
  try {
    var connection = yield amqp();

    var queue = connection.queue(nconf.get('amqpQueueName'), function() {
      queue.subscribe(co.wrap(function* (notificationId) {
        var FoundNotification = yield Notification.findById(notificationId).populate('user').exec();

        var arrivals = yield tflbus.getArrivalsByStopPointAndLineNumber(FoundNotification.stopPointId, FoundNotification.lineNumber);
      	arrivals = Arrival.statics.sanitise(arrivals);

        var currentMicrotime;
        var arrivalDate;
        var arrivalThreshold = FoundNotification.arrivalThreshold * 1000;

        var nextArrivals = arrivals.filter(function(arrival) {
          currentMicrotime = (new Date()).getTime();
          arrivalMicrotime = (new Date(arrival.expectedArrival)).getTime();

          if (currentMicrotime > (arrivalMicrotime - arrivalThreshold) && currentMicrotime < arrivalMicrotime) {
            return true;
          }

          return false;
        });

        if (nextArrivals.length) {
          try {
            yield FoundNotification.pushToDevice(nextArrivals[0]);
          }
          catch (e) {
            throw e;
          }
        }
      }));
    });
  }
  catch (e) {
    console.log(e);
  }
});
