var supreme = require('./index') || require('supreme-api');

console.log('Supreme Website \n' + supreme.url);

console.log('All Items on the Supreme Website: ');
supreme.getItems(function(items){
    console.log(items);
});

console.log('Get a single item:');
supreme.getItem('http://www.supremenewyork.com/shop/jackets/fman5r0xy/aw5dopam2', function(item){
    console.log(item);
});

console.log('Watch all items for every 5 seconds:');
supreme.watchAllItems(5, function(items) {
    console.log(items);
});

console.log('Stop watching all items:');
supreme.stopWatchingAllItems(function(status) {
    console.log(status);
});
