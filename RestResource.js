
var Promise = require('es6-promise').Promise;
var url = require('url');
var basicResource = require('./src/BasicResource');


module.exports = function RestResourceFactory(agent){
	var BasicResource = basicResource(agent);
	return function create(name, baseUrl, options, api){
		options = options || {};
		options[name] = {
			url: baseUrl,
			name: name
		}
		api = api ||{};
		var baseUrl = baseUrl || '/';
		
		
		api.createCRUD= function(newName, newUrl){
			if(options.parent) newOptions.parent.parent = options.parent;
			var newOptions = {};
			newOptions = {
				name: newName,
				url: newUrl,
				parent: options.parent
			};			
			return create(newName, newUrl, options, api);
		}

		
		// GET /items
		api['read' + capitaliseFirstLetter(name).plrl] = function(data, context){
			var url = prepareUrl(data, options[name]);
			var arg = [].slice.call(arguments);
			arg[2] = url;
			arg[3] = {};
		  return BasicResource.get.apply(this, arg);
		}

		// POST /items
		api['create' + capitaliseFirstLetter(name).sing] = function(data, context){
			var url = prepareUrl(data, options[name]);
			var arg = [].slice.call(arguments);
			arg[2] = url;
			arg[3] = {};
		  return BasicResource.post.apply(this, arg);
		}


		// PUT /items
		api['update' + capitaliseFirstLetter(name).plrl] = function(data, context){
			var url = prepareUrl(data, options[name]);
			var arg = [].slice.call(arguments);
			arg[2] = url;
			arg[3] = {};
		  return BasicResource.put.apply(this, arg);
		}

		// DEL /items
		api['delete' + capitaliseFirstLetter(name).plrl] = function(data, context){
			var url = prepareUrl(data, options[name]);
			var arg = [].slice.call(arguments);
			arg[2] = url;
			arg[3] = {};
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
			arg[3] = {};
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
			arg[3] = {};
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



function prepareUrl(data, options){
	var result = "";
	var opts = optionsToArray(options).reverse();
	var currentChunk = data;

	result = opts.reduce(function(url, chunk){
		currentChunk = currentChunk[chunk.name]		
		url+=makeUrl(chunk.url, currentChunk || {});		
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
function crud(name, baseUrl, result){
	return function createCRUD(inner_name, inner_url){

		var newUrl = [baseUrl, inner_url].join("");
		
		var newResult;
		if(result['with' + capitaliseFirstLetter(name).plrl]) {
			newResult = result['with' + capitaliseFirstLetter(name).plrl];
		}
		var newOptions =  {};		
		newOptions.parent = result;
		
		var newPlrlCrud = create(inner_name, inner_url, baseUrl, newResult);
		result['with' + capitaliseFirstLetter(name).plrl] = newPlrlCrud;		
		newResult = newPlrlCrud;


		var newOptions =  {};		
		newOptions.parent = result;		
		
		var newSingCrud = create(inner_name, inner_url, [baseUrl, ":id"].join("/"), newResult);
		result['with' + capitaliseFirstLetter(name).sing] = newSingCrud;
		
		return result;
	}
}

/*
module.exports = function RestResourceFactory(agent){
	var BasicResource = basicResource(agent);
	var api = {
  	createCRUD: create,
  }

  return api;

	function create(name, baseUrl){
		var result = {};
		result._meta = {
			name: name,
			baseUrl: baseUrl
		}

		Object.keys(BasicResource).reduce(function(res, method){
			res[method] = function(){
				var arg = arguments;
				arg[2] = [result._meta.baseUrl, arguments[2]].join("");
				return BasicResource[method].apply(this, arg);
			}
			return res;
		}, result);


		result['read' + capitaliseFirstLetter(name)] = function(options){
			return function (data, context, url){
				var arg = arguments;
				arg[2] = [result._meta.baseUrl, arguments[2]].join("");
				arg[3] = options;

		    return BasicResource.get.apply(this, arg);
		  }
		}

	  result.createCRUD = function(name, baseUrl){
	  	var newBase = [result._meta.baseUrl, baseUrl].join("");
	  	var newCrud = create(name, newBase);
	  	return result['with' + capitaliseFirstLetter(result._meta.name)] = newCrud;
	  }

	  return result;
	}
}



/*

var Users = RestResourceFactory.createCRUD('user', '/api/users');
RestResourceFactory.with(Users.readUser).createCRUD('item', '/items')



.readUser()
{:id, item: {:id}} -> .withUser.readItem() ->{Item}
{item: {:id}} -> .withUsers.readItem() ->{Item}
{item: [:id]} -> .withUsers.readItems() ->{Items}
{} -> .withUsers.readItems() ->{Items}

.withUsers.withItems.withWtf.get('/ddd')

*/
function capitaliseFirstLetter(string)
{
	return {
		sing:string.charAt(0).toUpperCase() + string.slice(1),
		plrl:string.charAt(0).toUpperCase() + string.slice(1) + "s"
	}
}