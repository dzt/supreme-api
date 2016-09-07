# Supreme API
## A NodeJS API for [supremenewyork.com](http://www.supremenewyork.com/)

### How to install
```npm install supreme-api --save```  

### Usage
```javascript
var supreme = require('supreme-api');

supreme.getItems(function(items){
    console.log(items);
});

supreme.getItem('http://www.supremenewyork.com/shop/jackets/fman5r0xy/aw5dopam2', function(item){
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
### Usage
* Watch and seek for changes on individual items.
