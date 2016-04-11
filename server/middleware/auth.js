var jwt = require('../lib/jwt');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Promise = require('bluebird');

Promise.promisifyAll(mongoose);

module.exports = function() {
  return function* (next) {
    if (this.request.url.indexOf('/auth') === 0) {
      yield next;
    }
    else {
      var jwtToken = this.request.header.authorization;

      try {
        var payload = yield jwt.verify(jwtToken);

        if (payload._id) {
          try {
            var FoundUser = yield User.findById(payload._id);

            if (FoundUser === null) {
              throw new Error('User not found');
            }

            this.User = FoundUser;
          }
          catch (e) {
            throw e;
          }
        }
        else {
          throw new Error('User _id not found in payload');
        }
      }
      catch (e) {
        this.status = 401;
        this.exception = e;
      }

      yield next;
    }
  }
};
