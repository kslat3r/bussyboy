var nconf = require('nconf');
var Pushwoosh = require('pushwoosh-client');
var Promise = require('bluebird');

module.exports = {
  client: null,

  init: function() {
    if (this.client === null) {
      if (process.env.NODE_ENV === 'production') {
        this.client = new Pushwoosh(process.env.PUSHWOOSH_APPLICATION_CODE, process.env.PUSHWOOSH_API_TOKEN);
      }
      else {
        this.client = new Pushwoosh(nconf.get('pushwooshApplicationCode'), nconf.get('pushwooshApiToken'));
      }
    }

    return this.client;
  },

  sendMessage: function(msg, deviceTokens) {
    return new Promise(function(resolve, reject) {
      this.init();

      this.client.sendMessage(msg, deviceTokens, {

      }, function(err, resp) {
        if (err || resp.code) {
          return reject(err || resp);
        }

        return resolve(resp);
      });
    }.bind(this));
  },

  registerDevice: function(pushToken, hwid, deviceTypeId) {
    return new Promise(function(resolve, reject) {
      this.init();

      this.client.registerDevice({
        language: 'en',
        push_token: pushToken,
        hwid: hwid,
        device_type: deviceTypeId
      }, function(err, resp) {
        if (err || resp.code) {
          return reject(err || resp);
        }

        return resolve(resp);
      });
    }.bind(this));
  }
};
