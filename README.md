# Supreme API
## A NodeJS API for [supremenewyork.com](http://www.supremenewyork.com/)

[![NPM](https://nodei.co/npm/supreme-api.png)](https://npmjs.org/package/supreme-api)

### How to install
```npm install supreme-api --save```  

### Usage
```javascript
const supreme = require('supreme-api');

supreme.getItems((items, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log(items);
});

supreme.getItem('http://www.supremenewyork.com/shop/jackets/fman5r0xy/aw5dopam2', (item, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log(item);
});

// check every 5 seconds
supreme.watchAllItems(5, (items, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log(items);
});
// Cancel Item watch
supreme.stopWatchingAllItems((status, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log(status);
});

// seek for a new item every 5 seconds
supreme.onNewItem(5, (product, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log('New Release: ' + item.name);
});

const category = 'jackets';
const keywords = "UNDERCOVER";
const style = 'Burgundy';

supreme.seek(category, keywords, style, (product, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log(product);
});

```
### Future of this project
* Watch and seek for changes on individual items.
