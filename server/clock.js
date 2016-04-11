var co = require('co');
var nconf = require('nconf');
var mongoose = require('mongoose');

require ('./models');
require('./lib/nconf')();
require('./lib/mongoose')();

var amqp = require('./lib/amqp');
var Notification = mongoose.model('Notification');

co(function* () {
  try {
    var connection = yield amqp();

    setInterval(co.wrap(function* () {
      var FoundNotifications = yield Notification.getActiveNotifications();

      FoundNotifications.forEach(function(FoundNotification) {
        if (FoundNotification.shouldPublishToQueue()) {
          connection.publish(nconf.get('amqpQueueName'), FoundNotification._id);
        }
      });
    }), nconf.get('amqpInterval'));
  }
  catch (e) {
    console.log(e);
  }
});
