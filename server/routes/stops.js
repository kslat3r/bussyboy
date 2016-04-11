var route = require('koa-route');
var controller = require('../controllers/stops');

module.exports = [
	route.get('/stops', controller.stopsByLatLng),
	route.get('/stops/:lineNumber/:direction', controller.stopsByLineNumber)
];
