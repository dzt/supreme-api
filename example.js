var supreme = require('./index') || require('supreme-api');

// Find Product Based on Keywords
const keywords = 'Nike';
const style = 'White';
const category = 'shoes';

// supreme.seek(category, keywords, style, (product, err) => {
//     if (err) {
//         console.log(err);
//         return err;
//     }
//     console.log(product);
// });

// supreme.getItems('shoes', (product, err) => {
//     if (err) {
//         console.log(err);
//         return err;
//     }
//     console.log(product);
// });

// supreme.getItem('http://www.supremenewyork.com/shop/shoes/rkxgtf1n2/rgrx634kb', (item, err) => {
//      if (err) {
//          console.log(err);
//          return err;
//      }
//      //console.log(item);
//  });

// supreme.onNewItem(5, "all", (items, err) => {
// 	if (err) {
// 		console.log(err);
// 		return err;
// 	}
//     console.log(items)
// });
