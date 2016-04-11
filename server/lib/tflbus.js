'use strict';

let fetch = require('node-fetch');
let util = require('util');

const API_HOSTNAME = 'https://api.tfl.gov.uk';
const STOPPOINTS_URI = '/StopPoint?lat=%s&lon=%s&stopTypes=NaptanPublicBusCoachTram&radius=250';
const LINE_URI = '/Line/%s/Route/Sequence/%s';
const ARRIVALS_URI = '/StopPoint/%s/Arrivals';

module.exports = {
  _fetch: function* (uri) {
    var url = API_HOSTNAME + uri;

    return yield fetch(url);
  },

  getStopPointsByLatLon: function* (lat, lon) {
    try {
      let response = yield this._fetch(util.format(STOPPOINTS_URI, lat, lon));

      return yield response.json();
    }
    catch (e) {
      return e;
    }
  },

  getStopPointsByLineNumber: function* (lineNumber, direction) {
    direction = direction || 'outbound';

    try {
      let response = yield this._fetch(util.format(LINE_URI, lineNumber, direction));

      return yield response.json();
    }
    catch (e) {
      return e;
    }
  },

  getArrivalsByStopPoint: function* (stopPoint) {
    try {
      let response = yield this._fetch(util.format(ARRIVALS_URI, stopPoint));
      response = yield response.json();

      return response.sort((a, b) => {
        var aMicrotime = new Date(a.expectedArrival).getTime();
        var bMicrotime = new Date(b.expectedArrival).getTime();

        if (aMicrotime < bMicrotime) {
          return -1;
        }

        if (aMicrotime > bMicrotime) {
          return 1;
        }

        return 0;
      });
    }
    catch (e) {
      return e;
    }
  },

  getArrivalsByStopPointAndLineNumber: function* (stopPoint, lineNumber) {
    try {
      let response = yield this.getArrivalsByStopPoint(stopPoint);

      return response.filter((arrival) => {
        if (parseInt(arrival.lineName) === lineNumber) {
          return true;
        }

        return false;
      });
    }
    catch (e) {
      return e;
    }
  }
};
