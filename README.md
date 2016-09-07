# Supreme API
## A NodeJS API for [supremenewyork.com](http://www.supremenewyork.com/)

### How to install
```npm install --save supreme-api```  

### Usage
```javascript
var supreme = require('supreme-api');

supreme.getItems(function(items){
    console.log(items);
});

supreme.getItem('/jackets/fman5r0xy/aw5dopam2', function(item){
    console.log(item);
});

// check every 5 seconds
supreme.watchAllItems(5, function(items) {
    console.log(items);
});

supreme.stopWatchingAllItems(function(status) {
    console.log(status);
});

// seek for a new item every 5 seconds
supreme.onNewItem(5, function(item) {
    console.log('New Release: ' + item.name);
});


```
