# Supreme API
## A NodeJS API for [supremenewyork.com](http://www.supremenewyork.com/)

[![NPM](https://nodei.co/npm/supreme-api.png)](https://npmjs.org/package/supreme-api)

### How to install
```npm install supreme-api --save```

Check out the [docs](https://github.com/dzt/supreme-api/wiki/Docs)!

### Usage
```javascript
const supreme = require('supreme-api');

supreme.getItems('all', (items, err) => {
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
supreme.watchAllItems(5, 'shoes', (items, err) => {
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

// Look for a new item every 5 seconds
supreme.onNewItem(5, (product, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log('New Release: ' + item.name);
});

// Find items based on specific keywords

const category = 'jackets';
const keywords = "UNDERCOVER";
const style = 'Burgundy';

supreme.seek(category, keywords, style, (product, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log(product);
    console.log(product.title); // example => Supreme®/UNDERCOVER Wool Overcoat
});

```

### Future of this project
* Watch and seek for changes on individual items. (Coming Soon)

## Contribution
Want to make a contribution? Fork the repo, add your changes, and submit a pull request. Any type of contributions (ideas, bug fixes, fixing typos, etc.) will be appreciated!


## License
supreme-api is licensed under [MIT License](https://github.com/dzt/supreme-api/blob/master/LICENSE).
