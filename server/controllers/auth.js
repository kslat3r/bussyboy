var mongoose = require('mongoose');
var User = mongoose.model('User');
var nconf = require('nconf');
var md5 = require('md5');
var jwt = require('../lib/jwt');

module.exports = {
  register: function* (next) {

    //does this user exist?

    try {
      var FoundUser = yield User.findOne({
        username: this.request.body.username
      });

      if (FoundUser === null) {

        //create user

        var NewUser = new User({
          username: this.request.body.username,
          password: md5(nconf.get('md5Salt') + this.request.body.password)
        });

        NewUser.save();

        //send jwt token

        this.body = {
          token: jwt.sign({
            _id: NewUser._id
          }),
          expiresIn: nconf.get('jwtExpiresIn')
        };
      }
      else {
        this.status = 500;
        this.exception = new Error('User already exists');
      }
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  },

  login: function* (next) {

    //does this user exist?

    try {
      var FoundUser = yield User.findOne({
        username: this.request.body.username,
        password: md5(nconf.get('md5Salt') + this.request.body.password)
      });

      if (FoundUser !== null) {

        //send jwt token

        this.body = {
          token: jwt.sign({
            _id: FoundUser._id
          }),
          expiresIn: nconf.get('jwtExpiresIn')
        };
      }
      else {
        this.status = 403;
        this.exception = new Error('User not found');
      }
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  }
};
