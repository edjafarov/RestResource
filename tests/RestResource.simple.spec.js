var RestResourceFactory = require('../RestResource');
var sinon = require('sinon');




var MockUserId = {
	id: 984
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

	})
	
	afterEach(function(){
		sandbox.restore();
	})

	describe('readUsers', function(){
		beforeEach(function(){
			API.readUsers({},{});
		})
		it('should get /api/users', function(){
			sinon.assert.calledWith(agent.get, '/api/users')
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
		it('should del /api/user/:id', function(){
			sinon.assert.calledWith(agent.get, '/api/users/' + MockUserId.id)
		})
	})	
	describe('readUser', function(){
		beforeEach(function(){
			API.readUser(MockUserId,{});
		})
		it('should del /api/user/:id', function(){
			sinon.assert.calledWith(agent.get, '/api/users/' + MockUserId.id)
		})
	})
	describe('readUser', function(){
		beforeEach(function(){
			API.readUser(MockUserId,{});
		})
		it('should del /api/user/:id', function(){
			sinon.assert.calledWith(agent.get, '/api/users/' + MockUserId.id)
		})
	})	
	describe('updateUser', function(){
		beforeEach(function(){
			API.updateUser(MockUser,{});
		})
		it('should del /api/user/:id', function(){
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

//console.log(API.readItems({},{}))

/*
API.withUser.createCRUD('item', '/item');
API.withUsers.createCRUD('top', '/top');
//console.log(Item);
API.withUsers.withTops.createCRUD('stuff', '/stuff');
//console.log(stuff);

console.log(API);
console.log(API.withUser.readItem({
	user:{
		id:10, 
		item:{
			id:12
		}
	}
}));
console.log(API.withUsers.withTops.readStuff({
	user:{
		top:{
			stuff:{
				id:123
			}
		}
	}
}));
/*console.log(User.withUser.readItem());
console.log(User.withUser.readItems());
console.log(User.withUsers.readItem());
console.log(User.withUsers.readItem())

//console.log(User.withUser);
/*
var crud = RestResource(agent);
var User = crud.createCRUD('user','/api/users');
var Item = User.createCRUD('item', '/items')*/
//console.log(Item.readItem())
//User.get({},{},'/test');
//console.log(User.withUser.readItem()({},{},''));
//User.withItems.get({},{}, '/test2')
//console.log(agent.get.getCall(0).args);
