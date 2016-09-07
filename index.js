var cheerio = require('cheerio'),
	request = require('request');

var api = {};

api.url = 'http://www.supremenewyork.com';

api.getItems = function(callback){
  // TODO Gets All items from Supreme
};

api.getItem = function(itemURL, callback){
  // TODO Gets the value of a single item
};

api.watchOnAllItems = [];

api.watchAllItems = function(interval, callback){
	api.log('Now watching for all items');
	api.watchOnAllItems = setInterval(function(){
		// TODO: Callback return change in items
	}, 1000 * interval); // Every xx sec
}

api.stopWatchingAllItems = function(matchId){
	clearInterval(api.watchOnAllItems);
	api.log('Stopped watching match #' + matchId);
}

// searches for new item drop
api.onNewItem = function(callback){
	api.watchAllItems(function(item){
		// TODO: If new items is find return callback(value);
	});
}

api.log = function(message){
	console.log('[supreme api] ' + message);
}

module.exports = api;
