module.exports = function* (next) {
  yield next;

  if (this.status !== 403) {
    return;
  }

  this.status = 403;
  this.body = {
    message: 'Forbidden',
    exception: this.exception.message
  };
};
