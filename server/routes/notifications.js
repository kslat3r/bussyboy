var route = require('koa-route');
var controller = require('../controllers/notifications');

module.exports = [
	route.get('/notifications', controller.list),
  route.get('/notifications/:id', controller.get),
  route.post('/notifications', controller.create),
  route.put('/notifications/:id', controller.update),
  route.delete('/notifications/:id', controller.delete),
  route.delete('/notifications', controller.deleteAll)
];
