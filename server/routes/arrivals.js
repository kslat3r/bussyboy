var route = require('koa-route');
var controller = require('../controllers/arrivals');

module.exports = [
	route.get('/arrivals/:stopPoint', controller.arrivalsByStopPoint),
	route.get('/arrivals/:stopPoint/:lineNumber', controller.arrivalsByStopPointAndLineNumber)
];
