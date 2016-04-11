var nconf = require('nconf');
var mongoose = require('mongoose');
var Promise = require('bluebird');

Promise.promisifyAll(mongoose);

module.exports = function() {
  var connect = function() {
    var opts = {
      server: {
        socketOptions: {
          keepAlive: 1
        }
      }
    };

    if (process.env.NODE_ENV === 'production') {
      mongoose.connect(process.env.MONGOLAB_URI, opts);
    }
    else {
      mongoose.connect(nconf.get('dbUrl'), opts);
    }
  };

  connect();
  mongoose.connection.on('error', console.log);
  mongoose.connection.on('disconnected', connect);
};
