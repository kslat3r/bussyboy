module.exports = function* (next) {
  yield next;

  if (this.status !== 500) {
    return;
  }

  this.status = 500;
  this.body = {
    message: 'Internal Server Error',
    exception: this.exception.message
  };
};
