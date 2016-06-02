var _ = require('lodash'),
  uid = require('uid-safe');

module.exports = function(option) {
  var store = {};
  var cookieName = 'koa.sid';
  var cookieOption = {
    httpOnly: true,
    path: '/',
    overwrite: true,
    signed: true,
    maxAge: 24 * 60 * 60 * 1000
  };

  return function *session(next) {
    var token = this.cookies.get(cookieName);
    if(token && _.has(store, token)) {
      this.session = store[token];
    }

    if(!this.session) {
      this.session = {};  
    }
    
    yield next;

    if(!token) {
      token = uid(24);
      this.cookies.set(cookieName, token, cookieOption);
      if(this.session) {
        store[token] = this.session;
      }
    }
    
    if(!this.session) {
      delete store[token];
    }
  }
};
