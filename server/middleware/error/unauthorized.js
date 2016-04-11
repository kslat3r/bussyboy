module.exports = function* (next) {
  yield next;

  if (this.status !== 401) {
    return;
  }

  this.status = 401;
  this.body = {
    message: 'Unauthozied',
    exception: this.exception.message
  };
};
