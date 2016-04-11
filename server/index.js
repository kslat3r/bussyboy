var koa = require('koa');
var logger = require('koa-logger');
var json = require('koa-json');
var bodyParser = require('koa-body-parser');

//configure nconf

require('./lib/nconf')();

//connect to mongo

require('./lib/mongoose')();

//models and routes

var models = require('./models');
var routes = require('./routes');

//start koa

var app = koa();

//middleware

var auth = require('./middleware/auth');

app.use(logger());
app.use(json({
  pretty: false
}));
app.use(bodyParser());
app.use(auth());

//routes

routes.forEach((route) => {
  app.use(route);
});

//errors

var pageNotFound = require('./middleware/error/pageNotFound');
var forbidden = require('./middleware/error/forbidden');
var unauthorized = require('./middleware/error/unauthorized');
var internalServerError = require('./middleware/error/internalServerError');

app.use(forbidden);
app.use(unauthorized);
app.use(internalServerError);
app.use(pageNotFound);

//let's go!

app.listen(process.env.PORT || 3000);
console.log('listening on port ' + (process.env.PORT || 3000));
