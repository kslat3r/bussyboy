var mongoose = require('mongoose');
var Notification = mongoose.model('Notification');

module.exports = {
  list: function* (next) {
    try {
      this.body = yield Notification.find({
        user: this.User._id
      });
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  },

  get: function* (id, next) {
    try {
      var FoundNotification = yield Notification.findOne({
        _id: id,
        user: this.User._id
      });

      if (FoundNotification === null) {
        this.status = 404;
      }
      else {
        this.body = FoundNotification;
      }
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  },

  //{"lineNumber":42,"stopPointId":"490004315BH","threshold":60,"periodStart":"15:15:00","periodEnd":"15:30:00","activeDays":[0]}

  create: function* (next) {
    try {
      var NewNotification = new Notification();

      yield Notification.setPropsAndSave.call(this, NewNotification);

      this.body = NewNotification;
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  },

  update: function* (id, next) {
    try {
      var FoundNotification = yield Notification.findOne({
        _id: id,
        user: this.User._id
      });

      if (FoundNotification === null) {
        this.status = 404;
      }
      else {
        yield Notification.setPropsAndSave.call(this, FoundNotification);

        this.body = FoundNotification;
      }
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  },

  delete: function* (id, next) {
    try {
      var FoundNotification = yield Notification.findOne({
        _id: id,
        user: this.User._id
      });

      if (FoundNotification === null) {
        this.status = 404;
      }
      else {
        FoundNotification.remove();

        this.body = {};
      }
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  },

  deleteAll: function* (next) {
    try {
      yield Notification.remove({});

      this.body = {};
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  }
};
