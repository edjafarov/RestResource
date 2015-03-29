
var Promise = require('es6-promise').Promise;
var url = require('url');
var basicResource = require('./src/BasicResource');


module.exports = function RestResourceFactory(agent){
	var BasicResource = basicResource(agent);
	return function create(name, baseUrl, options, api){
		options = options || {};
		options[name] = {
			url: baseUrl,
			name: name,
			parent: options.parent
		}
		api = api ||{};
		

		Object.keys(BasicResource).reduce(function(res, method){
			res[method] = function(data){
				var arg = arguments;
				var url = [prepareUrl(data, options.parent),arg[2]].join("");
				arg[0] = data.body;
				arg[2] = url;
				return BasicResource[method].apply(this, arg);
			}
			return res;
		}, api);
		
		
		api.createCRUD= function(newName, newUrl){
			var newOptions = {};

			newOptions = {
				name: newName,
				url: newUrl,
				parent: options.parent
			};			
			if(options.parent) newOptions.parent.parent = options.parent;
			return create(newName, newUrl, options, api);
		}

		
		// GET /items
		api['read' + capitaliseFirstLetter(name).plrl] = function(data, context){
			var url = prepareUrl(data, options[name]);
			var arg = [].slice.call(arguments);
			arg[2] = url;
			arg[3] = {
				query: parseQuery(data, options[name])
			};
		  return BasicResource.get.apply(this, arg);
		}

		// POST /items
		api['create' + capitaliseFirstLetter(name).sing] = function(data, context){
			var url = prepareUrl(data, options[name]);
			var arg = [].slice.call(arguments);
			arg[0] = getLastChunk(data, options[name]);
			arg[2] = url;
			arg[3] = {};
		  return BasicResource.post.apply(this, arg);
		}


		// PUT /items
		api['update' + capitaliseFirstLetter(name).plrl] = function(data, context){
			var url = prepareUrl(data, options[name]);
			var arg = [].slice.call(arguments);
			arg[0] = getLastChunk(data, options[name]);
			arg[2] = url;
			arg[3] = {};
		  return BasicResource.put.apply(this, arg);
		}

		// DEL /items
		api['delete' + capitaliseFirstLetter(name).plrl] = function(data, context){
			var url = prepareUrl(data, options[name]);
			var arg = [].slice.call(arguments);
			arg[2] = url;
			arg[3] = {
				query: parseQuery(data, options[name])
			};
		  return BasicResource.del.apply(this, arg);
		}

		// GET /items/:id
		api['read' + capitaliseFirstLetter(name).sing] = function(data, context){
			var newOptions = {
				name: options[name].name,
				url: [options[name].url, ":id"].join("/"),
				parent: options[name].parent
			};			
			
			var url = prepareUrl(data, newOptions);
			var arg = [].slice.call(arguments);
			arg[2] = url;
			arg[3] = {
				query: parseQuery(data, newOptions)
			}
		  return BasicResource.get.apply(this, arg);
		}

		// PUT /items/:id
		api['update' + capitaliseFirstLetter(name).sing] = function(data, context){
			var newOptions = {
				name: options[name].name,
				url: [options[name].url, ":id"].join("/"),
				parent: options[name].parent
			};			
			
			var url = prepareUrl(data, newOptions);
			var arg = [].slice.call(arguments);
			arg[0] = getLastChunk(data, newOptions);
			arg[2] = url;
			arg[3] = {};
		  return BasicResource.put.apply(this, arg);
		}

		api['delete' + capitaliseFirstLetter(name).sing] = function(data, context){
			var newOptions = {
				name: options[name].name,
				url: [options[name].url, ":id"].join("/"),
				parent: options[name].parent
			};			
			
			var url = prepareUrl(data, newOptions);
			var arg = [].slice.call(arguments);
			arg[2] = url;
			arg[3] = {
				query: parseQuery(data, newOptions)
			};
		  return BasicResource.del.apply(this, arg);
		}


		api['with' + capitaliseFirstLetter(name).sing] = {
			createCRUD: function(newName, newUrl){
				var newOptions = {};
				newOptions.parent = {
					name: name,
					url: [baseUrl, ":id"].join("/")
				};
				if(options.parent) newOptions.parent.parent = options.parent;
				return create(newName, newUrl, newOptions, api['with' + capitaliseFirstLetter(name).sing]);
			}
		}

		api['with' + capitaliseFirstLetter(name).plrl] = {
			createCRUD: function(newName, newUrl){
				var newOptions = {};
				newOptions.parent = {
					name: name,
					url: baseUrl
				};
				if(options.parent) newOptions.parent.parent = options.parent;
				return create(newName, newUrl, newOptions, api['with' + capitaliseFirstLetter(name).plrl]);
			}
		}	

		return api;
	}
}

function parseQuery(data, newOptions){
	return function(){
		var lastChunk = getLastChunk(data, newOptions);
		return Object.keys(lastChunk).reduce(function(result, name){
			if(Array.isArray(lastChunk[name])) {
				result[name] = lastChunk[name].join(",")
			}
			return result;
		}, lastChunk);
	}
}


function getLastChunk(data, options){
	var opts = optionsToArray(options).reverse();
	var currentChunk = data;
	
	opts.forEach(function(chunk){
		currentChunk = currentChunk[chunk.name] ||currentChunk|| {};		
	},"")
	return currentChunk;
}
function prepareUrl(data, options){
	var result = "";
	var opts = optionsToArray(options).reverse();
	var currentChunk = data;
	result = opts.reduce(function(url, chunk){
		currentChunk = currentChunk[chunk.name] ||currentChunk|| {};		
		url+=makeUrl(chunk.url, currentChunk);		
		return url;
	},"")
	return result;
}


function makeUrl(url, params){
  return Object.keys(params).reduce(function(urlString, name){
    urlString = urlString.replace(new RegExp("\\/(:" + name + ")(\\/|$)","g"), ["/", params[name], "/"].join(""));
    urlString = urlString.replace(/\/$/, "");
    return urlString;
  }, url);
}

function optionsToArray(options){
	var result = [];
	result.push(options);
	if(options.parent) result = result.concat(optionsToArray(options.parent));
	return result;
}

function traverseUrl(options){
	var pre = "";
	if(options.parent) pre+=traverseUrl(options.parent);
	return pre + options.url;
}




/*

var Users = RestResourceFactory.createCRUD('user', '/api/users');
RestResourceFactory.with(Users.readUser).createCRUD('item', '/items')



.readUser()
{:id, item: {:id}} -> .withUser.readItem() ->{Item}
{item: {:id}} -> .withUsers.readItem() ->{Item}
{item: [:id]} -> .withUsers.readItems() ->{Items}
{} -> .withUsers.readItems() ->{Items}

//query params
//body
//path
//change id
{:id, a:1, b:2}
GET
get?a=1&b=2
{id:[id1, id2, id3, id4]}
get?id=id1,id2,id3,id4


PUT
{a:1,b:2}

{a:1,b:2, query: {://}}
{:id, body: {:}}

POST
{a:1,b:2}

DELETE
?a=1&b=2


{:id
	item:{
		:id,
		body:{
			:id,
			:name
		}
	}
}

API. req

API.withUser({id}).changeItem({})
().withUser(User).item({:id})
context.createItem(API.withUser(User).Item({}))

.withUsers.withItems.withWtf.get('/ddd')



*/
function capitaliseFirstLetter(string)
{
	return {
		sing:string.charAt(0).toUpperCase() + string.slice(1),
		plrl:string.charAt(0).toUpperCase() + string.slice(1) + "s"
	}
}