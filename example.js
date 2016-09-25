var supreme = require('./index') || require('supreme-api');

// Find Product Based on Keywords
const keywords = "UNDERCOVER";
const style = 'Burgundy';
const category = 'jackets';

supreme.seek(category, keywords, style, (product, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log(product);
});


supreme.getItems('bags', (product, err) => {
    if (err) {
        console.log(err);
        return err;
    }
    console.log(product);
});

