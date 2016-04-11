var nconf = require('nconf');
var amqp = require('amqp');
var Promise = require('bluebird');

Promise.promisifyAll(amqp);

var connection = null;

module.exports = function() {
  return new Promise(function(resolve, reject) {
    if (connection !== null) {
      resolve(connection);
    }

    connection = amqp.createConnection({
      url: process.env.NODE_ENV === 'production' ? process.env.CLOUDAMQP_URL : nconf.get('amqpUrl')
    });

    connection.on('ready', function() {
      resolve(connection);
    });

    connection.on('error', function(err) {
      reject(err);
    });
  });
};
