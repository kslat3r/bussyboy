var nconf = require('nconf');
var jwt = require('jsonwebtoken');
var Promsie = require('bluebird');

module.exports = {
  sign: function(payload) {
    return jwt.sign(payload, nconf.get('jwtSecretKey'), {
      expiresIn: nconf.get('jwtExpiresIn'),
      issuer: nconf.get('jwtIssuer')
    });
  },

  verify: function(token) {
    return new Promise(function(resolve, reject) {
      jwt.verify(token, nconf.get('jwtSecretKey'), {
        issuer: nconf.get('jwtIssuer')
      }, function(err, payload) {
        if (err) {
          return reject(err);
        }

        return resolve(payload);
      });
    });
  }
};
