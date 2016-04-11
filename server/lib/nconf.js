var nconf = require('nconf');

module.exports = function() {
  nconf.argv()
    .env()
    .file({
      file: process.env.NODE_ENV === undefined ? __dirname + '/../config/development.json' : __dirname + '/../config/' + process.env.NODE_ENV + '.json'
    });
};
