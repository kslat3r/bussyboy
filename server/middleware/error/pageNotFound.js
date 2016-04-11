module.exports = function* (next) {
  yield next;

  if (this.status !== 404) {
    return;
  }

  this.status = 404;
  this.body = {
    message: 'Page Not Found'
  };
};
