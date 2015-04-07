var RestResourceFactory = require('../RestResource');
var sinon = require('sinon');
var PromisePipe = require('promise-pipe')();

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

describe('piped API', function(){
	var API;
	var sandbox;
	var RestResource;
	var agent;
	var resp;
	var pipe;
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
		
		PromisePipe.use('api', API);
	});
	
	afterEach(function(){
		sandbox.restore();
	})

	describe('readUsers', function(){
		beforeEach(function(done){
			pipe = PromisePipe().api.readUsers();
			pipe({},{}).then(function(){done()});
		})
		it('should get /api/users', function(){
			sinon.assert.calledWith(agent.get, '/api/users')
		})
	})

	describe('withUsers.readItems', function(){
		beforeEach(function(done){
			pipe = PromisePipe().api.withUsers.readItems();
			pipe({},{}).then(function(){done()});
		})
		it('should get /api/users/items', function(){
			sinon.assert.calledWith(agent.get, '/api/users/items')
		})
	})

	describe('withUsers.readItem', function(){
		beforeEach(function(done){
			pipe = PromisePipe().api.withUsers.readItem();
			pipe({item:{id:5}},{}).then(function(){done()});
		})
		it('should get /api/users/items', function(){
			sinon.assert.calledWith(agent.get, '/api/users/items/5')
		})
	})

	describe('withUsers.createItems', function(){
		beforeEach(function(done){
			pipe = PromisePipe().api.withUsers.createItem();
			pipe(MockItem,{}).then(function(){done()});
		})
		it('should post /api/users/items', function(){
			sinon.assert.calledWith(agent.post, '/api/users/items')
			sinon.assert.calledWith(resp.send, MockItem)
		})
	})	
	describe('withUsers.updateItems', function(){
		beforeEach(function(done){
			pipe = PromisePipe().api.withUsers.updateItems();
			pipe(MockItems,{}).then(function(){done()});
		})
		it('should put /api/users/items', function(){
			sinon.assert.calledWith(agent.put, '/api/users/items')
			sinon.assert.calledWith(resp.send, MockItems)
		})
	})
	describe('deleteItems', function(){
		beforeEach(function(done){
			pipe = PromisePipe().api.deleteUsers();
			pipe(MockItems,{}).then(function(){done()});
		})
		it('should del /api/users', function(){
			sinon.assert.calledWith(agent.del, '/api/users')
		})
	})
	describe('withUser.readItem', function(){
		beforeEach(function(done){
			pipe = PromisePipe().api.withUser.readFoo();
			pipe(MockId,{}).then(function(){done()});
		})
		it('should del /api/user/:id/foo/:id', function(){
			sinon.assert.calledWith(agent.get, '/api/users/' + MockId.id +'/foo/' + MockId.foo.id)
		})
	})	

});


