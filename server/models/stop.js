module.exports = {
  statics: {
    sanitise: function(result) {
      if (!result.length) {
        return [];
      }

      return result.map((stop) => {
        return {
          id: stop.id,
          name: stop.name || (stop.commonName + ' (towards ' + stop.additionalProperties[stop.additionalProperties.length - 1].value + ')'),
          letter: stop.stopLetter,
          lat: stop.lat,
          lon: stop.lon
        };
      });
    }
  }
};
