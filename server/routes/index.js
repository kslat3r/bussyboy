var fs = require('fs');

var files = fs.readdirSync(__dirname);
var out = [];

files.forEach((file) => {
	if (file.indexOf('index') === -1) {
		var required = require('./' + file.replace(/\.js/, ''));

		required.forEach((r) => {
			out.push(r);
		});
	}
});

module.exports = out;
