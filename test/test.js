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
});