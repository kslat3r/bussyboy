var route = require('koa-route');
var controller = require('../controllers/auth');

module.exports = [
	route.post('/auth/register', controller.register),
	route.post('/auth/login', controller.login)
];
