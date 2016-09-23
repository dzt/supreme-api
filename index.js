var cheerio = require('cheerio'),
    request = require('request');

var api = {};

api.url = 'http://www.supremenewyork.com';

String.prototype.capitalizeEachWord = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// getItem('all')
// other options: new, jackets, shirts, tops_sweaters, sweatshirts,
// pants, hats, bags, accessories, shoes, skate

/**
 * Checks for items under desired category
 *
 * @param  {String} category
 * @return {Array}
 */

api.getItems = function(category, callback) {

    var getURL = api.url + '/shop/all/' + category;
    if (category == 'all') {
      getURL = api.url + '/shop/all';
    }

    request(getURL, function(err, resp, html, rrr, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(html);
            var parsedResults = [];
            var count = $('img').length;
            // console.log(len);
            $('img').each(function(i, element) {

                var nextElement = $(this).next();
                var prevElement = $(this).prev();
                var image = "https://" + $(this).attr('src').substring(2);
                var title = $(this).attr('alt');
                var availability = nextElement.text().capitalizeEachWord();
                var link = api.url + this.parent.attribs.href;

                if (availability == "") availability = "Available";

                request(link, function(err, resp, html, rrr, body) {

                    var $ = cheerio.load(html);

                    var metadata = {
                        title: $('h1').attr('itemprop', 'name').eq(1).html(),
                        style: $('.style').attr('itemprop', 'model').text(),
                        link: link,
                        description: $('.description').text(),
                        price: parseInt(($('.price')[0].children[0].children[0].data).replace('$', '').replace(',', '')),
                        image: image,
                        images: [],
                        availability: availability
                    };

                    // Some items don't have extra images (like some of the skateboards)
                    if ($('.styles').length > 0) {
                        var styles = $('.styles')[0].children;
                        for (li in styles) {
                            for (a in styles[li].children) {
                                if (styles[li].children[a].attribs['data-style-name'] == metadata.style) {
                                    metadata.images.push('https:' + JSON.parse(styles[li].children[a].attribs['data-images']).zoomed_url)
                                }
                            }
                        }
                    } else if (title.indexOf('Skateboard') != -1) {
                        // Because fuck skateboards
                        metadata.images.push('https:' + $('#img-main').attr('src'))
                    }

                    parsedResults.push(metadata);

                    if (!--count) {
                        callback(parsedResults, null);
                    }

                })

            });
        } else if (err && resp.statusCode != 200) {
            console.log("Error: " + err + "\n with status code: " + resp.statusCode);
        } else {
            console.log("Unknown error");
        }
    });
};

api.getItem = function(itemURL, callback) {
    // TODO Gets the value of a single item

    request(itemURL, function(err, resp, html, rrr, body) {

        var $ = cheerio.load(html);

        var metadata = {
            title: $('h1').attr('itemprop', 'name').eq(1).html(),
            style: $('.style').attr('itemprop', 'model').text(),
            link: itemURL,
            description: $('.description').text(),
            price: parseInt(($('.price')[0].children[0].children[0].data).replace('$', '').replace(',', '')),
            image: 'TODO',
            images: [],
            availability: 'TODO'
        };

        // Some items don't have extra images (like some of the skateboards)
        if ($('.styles').length > 0) {
            var styles = $('.styles')[0].children;
            for (li in styles) {
                for (a in styles[li].children) {
                    if (styles[li].children[a].attribs['data-style-name'] == metadata.style) {
                        metadata.images.push('https:' + JSON.parse(styles[li].children[a].attribs['data-images']).zoomed_url)
                    }
                }
            }
        } else if (title.indexOf('Skateboard') != -1) {
            metadata.images.push('https:' + $('#img-main').attr('src'))
        }

        callback(null, metadata);
    });
};

api.watchOnAllItems = [];
api.watchAllItems = function(interval, callback) {
    api.log('Now watching for all items');
    api.watchOnAllItems = setInterval(function() {
      api.getItems(function(items){
          callback(null, items);
      });
    }, 1000 * interval); // Every xx sec
}

api.stopWatchingAllItems = function(callback) {
    clearInterval(api.watchOnAllItems);
    if (api.watchOnAllItems == "") {
      callback(null, 'No watching processes found.');
    } else {
      callback('Watching has stopped.', null);
    }
}

// searches for new item drop TODO
api.onNewItem = function(callback) {
    api.watchAllItems(function(item) {
        // TODO: If new items is find return callback(value);
    });
}

/**
 * Seeks for items on desired category page with specific keywords/styles.
 * @param  {Number} interval
 * @param  {String} category
 * @param  {String} style
 * @param  {String} category
 * @return {Object}
 */
api.seek = function(category, keywords, styleSelection, callback) {
 var productLink = [];
    api.getItems(category, items => {
        for (i = 0; i < items.length; i++) {
            var title = items[i].title;
            var style = items[i].style;

            if (style === null) {
                // type - style note defined without a match
                if (title.indexOf(keywords) > -1) { // check if the keywords match with the title
                    // found item
                    productLink.push(items[i].link);
                    callback(items[i], null);
                    break;
                } else {
                    continue;
                }
            } else if (style == styleSelection) {
                // type - style defined with match
                if (title.indexOf(keywords) > -1) { // check if the keywords match with the title
                    // found item
                    productLink.push(items[i].link);
                    callback(items[i], null);
                    break;
                } else {
                    continue;
                }
            }
        }

        if (productLink[0] === undefined) {
            callback(null, "Could not find any results matching your keywords.");
        }

    });
}

api.log = function(message) {
    console.log('[supreme api] ' + message);
}

module.exports = api;
