var RestResourceFactory = require('../RestResource');
var sinon = require('sinon');




var MockUserId = {
	id: 984
};

var MockUserIdOpt = {
	id: 984,
	opt1: "opt1",
	opt2: "opt2"
};

var MockUsersOpt = {
	opt1: "opt1",
	opt2: ["opt21", "opt22", "opt23"]
};

var MockUser = {
	id: 984,
	name: "MockUser"
};

var MockUsers = [{
	name: "MockUser1"
},{
	name: "MockUser2"
},{
	name: "MockUser3"
}];

describe('simple API', function(){
	var API;
	var sandbox;
	var RestResource;
	var agent;
	var resp;
	beforeEach(function(){
		sandbox = sinon.sandbox.create()
		resp = {
			on: sandbox.spy(),
			end: sandbox.stub(),
			send: sandbox.stub(),
			query: sandbox.stub()
		}


		agent = {
			get: sandbox.stub(),
			post: sandbox.stub(),
			put: sandbox.stub(),
			del: sandbox.stub(),
			patch: sandbox.stub()
		};
		resp.end.callsArgWith(0, {body:"OK"});
		agent.get.returns(resp);
		agent.post.returns(resp);
		agent.put.returns(resp);
		agent.del.returns(resp);
		agent.patch.returns(resp);
		RestResource = RestResourceFactory(agent);
		API  = RestResource('user', '/api/users');

	})
	
	afterEach(function(){
		sandbox.restore();
	})

	describe('readUsers', function(){
		beforeEach(function(){
			API.readUsers({},{});
		})
		it('should get /api/users', function(){
			sinon.assert.calledWith(agent.get, '/api/users');
		})
	})

	describe('readUsers with opts', function(){
		beforeEach(function(){
			API.readUsers(MockUsersOpt,{});
		})
		it('should get /api/users', function(){
			sinon.assert.calledWith(agent.get, '/api/users')
			sinon.assert.calledWith(resp.query, {opt1: "opt1", opt2:"opt21,opt22,opt23"});

		})
	})	
	describe('createUser', function(){
		beforeEach(function(){
			API.createUser(MockUser,{});
		})
		it('should post /api/users', function(){
			sinon.assert.calledWith(agent.post, '/api/users')
			sinon.assert.calledWith(resp.send, MockUser)
		})
	})	
	describe('updateUsers', function(){
		beforeEach(function(){
			API.updateUsers(MockUsers,{});
		})
		it('should put /api/users', function(){
			sinon.assert.calledWith(agent.put, '/api/users')
			sinon.assert.calledWith(resp.send, MockUsers)
		})
	})
	describe('deleteUsers', function(){
		beforeEach(function(){
			API.deleteUsers(MockUsers,{});
		})
		it('should del /api/users', function(){
			sinon.assert.calledWith(agent.del, '/api/users')
			//sinon.assert.calledWith(resp.send, MockUsers)
		})
	})
	describe('readUser', function(){
		beforeEach(function(){
			API.readUser(MockUserId,{});
		})
		it('should get /api/user/:id', function(){
			sinon.assert.calledWith(agent.get, '/api/users/' + MockUserId.id)
		})
	})	

	describe('readUser with opts', function(){
		beforeEach(function(){
			API.readUser(MockUserIdOpt,{});
		})
		it('should get /api/user/:id', function(){
			sinon.assert.calledWith(agent.get, '/api/users/' + MockUserId.id)
			sinon.assert.calledWith(resp.query, MockUserIdOpt)
		})
	})	

	describe('updateUser', function(){
		beforeEach(function(){
			API.updateUser(MockUser,{});
		})
		it('should put /api/user/:id', function(){
			sinon.assert.calledWith(agent.put, '/api/users/' + MockUserId.id)
			sinon.assert.calledWith(resp.send, MockUser)
		})
	})
	describe('deleteUser', function(){
		beforeEach(function(){
			API.deleteUser(MockUserId,{});
		})
		it('should del /api/user/:id', function(){
			sinon.assert.calledWith(agent.del, '/api/users/' + MockUserId.id)
		})
	})	
});
