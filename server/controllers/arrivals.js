var tflbus = require('../lib/tflbus');
var Arrival = require('../models/arrival');

module.exports = {
  arrivalsByStopPoint: function* (stopPoint, next) {
    try {
      var result = yield tflbus.getArrivalsByStopPoint(stopPoint);

      this.body = Arrival.statics.sanitise(result);
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  },

  arrivalsByStopPointAndLineNumber: function* (stopPoint, lineNumber, next) {
    try {
      var result = yield tflbus.getArrivalsByStopPointAndLineNumber(stopPoint, lineNumber);

      this.body = Arrival.statics.sanitise(result);
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  }
};
