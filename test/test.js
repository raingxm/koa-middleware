var request = require('co-supertest'),
	koa = require('koa'),
	session = require('../src/session');


require('co-mocha');

var app = koa();

app.keys = ['secret keys here'];

app.use(session());

app.use(function *() {
	switch(this.request.url) {
		case '/setname':
			this.session.userName = 'zhangxu';
			this.body = this.session.userName;
			break;
		case '/getname':
			this.body = this.session.userName;
			break;
    case '/clear':
      this.session = null;
      this.status = 204;
	}
});

var server = app.listen();

describe('Testing rethink DB middleware', function() {
	describe('Set session value', function() {
		var agent;
		before(function *(){
			agent = request.agent(server);
		});

		it('Should set name in session object', function *() {
			yield agent
				.get('/setname')
				.expect(200)
				.end();
		});
	});

	describe('Retrieve session value', function() {
		var agent;
		before(function *() {
			agent = request.agent(server);
			yield agent
				.get('/setname')
				.expect(200)
				.end();
		});

		it('should find the userName in session', function *() {
			 yield agent
			 	.get('/getname')
			 	.expect('zhangxu')
			 	.end();
		});
	});

  describe('Destory Session', function () {
    var agent;
    before(function *() {
      agent = request.agent(server);
      yield agent
        .get('/setname')
        .expect(200)
        .end();
    });

    it('Should not find session userName', function *() {
      yield agent
        .get('/getname')
        .expect('zhangxu')
        .end();
      yield agent
        .del('/clear')
        .expect(204)
        .end();
      yield agent
        .get('/getname')
        .expect('')
        .end();
    })
  });
});
