var RestResourceFactory = require('../RestResource');
var sinon = require('sinon');




var MockId = {
	id: 984,
	foo: {
		id: 123
	}
};
var MockItem = {
	id: 984,
	name: "MockItem"
};
var MockFoo = {
	id: 123,
	name: "MockFoo"
};

var MockItems = [{
	name: "MockItem1"
},{
	name: "MockItem2"
},{
	name: "MockItem3"
}];

describe('nested API', function(){
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
			send: sandbox.stub()
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
		API.withUsers.createCRUD('item', '/items');
		API.withUser.createCRUD('foo', '/foo');
	})
	
	afterEach(function(){
		sandbox.restore();
	})

	describe('withUsers.readItems', function(){
		beforeEach(function(){
			API.withUsers.readItems({},{});
		})
		it('should get /api/users/items', function(){
			sinon.assert.calledWith(agent.get, '/api/users/items')
		})
	})
	describe('withUsers.createItems', function(){
		beforeEach(function(){
			API.withUsers.createItem(MockItem,{});
		})
		it('should post /api/users/items', function(){
			sinon.assert.calledWith(agent.post, '/api/users/items')
			sinon.assert.calledWith(resp.send, MockItem)
		})
	})	
	describe('withUsers.updateItems', function(){
		beforeEach(function(){
			API.withUsers.updateItems(MockItems,{});
		})
		it('should put /api/users/items', function(){
			sinon.assert.calledWith(agent.put, '/api/users/items')
			sinon.assert.calledWith(resp.send, MockItems)
		})
	})
	describe('withUsers.deleteItems', function(){
		beforeEach(function(){
			API.deleteUsers(MockItems,{});
		})
		it('should del /api/users', function(){
			sinon.assert.calledWith(agent.del, '/api/users')
		})
	})
	describe('withUser.readFoo', function(){
		beforeEach(function(){
			API.withUser.readFoo(MockId,{});
		})
		it('should del /api/user/:id/foo/:id', function(){
			sinon.assert.calledWith(agent.get, '/api/users/' + MockId.id +'/foo/' + MockId.foo.id)
		})
	})	
	
	describe('updateFoo', function(){
		beforeEach(function(){
			MockId.foo = MockFoo;
			API.withUser.updateFoo(MockId,{});
		})
		it('should del /api/user/:id', function(){
			sinon.assert.calledWith(agent.put, '/api/users/' + MockId.id +'/foo/' + MockFoo.id)
			sinon.assert.calledWith(resp.send, MockFoo)
		})
	})

	describe('deleteUser', function(){
		beforeEach(function(){
			API.withUser.deleteFoo(MockId,{});
		})
		it('should del /api/user/:id', function(){
			sinon.assert.calledWith(agent.del, '/api/users/' + MockId.id +'/foo/' + MockFoo.id)
		})
	})	
});


