module.exports = function(option) {
  return function *session(next) {
    this.session = {};
    yield next;
  }
};