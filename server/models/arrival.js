module.exports = {
  statics: {
    sanitise: function(result) {
      return result.map((arrival) => {
        return {
          expectedArrival: arrival.expectedArrival,
          currentLocation: arrival.currentLocation,
          destinationName: arrival.destinationName,
          stopPointName: arrival.stationName,
          stopPointLetter: arrival.platformName,
          lineNumber: arrival.lineName
        };
      });
    }
  }
};
