var tflbus = require('../lib/tflbus');
var Stop = require('../models/stop');

module.exports = {
  stopsByLatLng: function* (next) {
    try {
      if (!this.query.lat) {
        throw new Error('Lat param is required');
      }

      if (!this.query.lon) {
        throw new Error('Lon param is required');
      }

      var result = yield tflbus.getStopPointsByLatLon(this.query.lat, this.query.lon);

      this.body = Stop.statics.sanitise(result.stopPoints);
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  },

  stopsByLineNumber: function* (lineNumber, direction, next) {
    try {
      var result = yield tflbus.getStopPointsByLineNumber(lineNumber, direction);

      this.body = Stop.statics.sanitise(result.stopPointSequences[0].stopPoint);
    }
    catch (e) {
      this.status = 500;
      this.exception = e;
    }

    yield next;
  }
};
