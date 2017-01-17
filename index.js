var cheerio = require('cheerio');
var request = require('request');
var request = require('request').defaults({
    //timeout: 30000
});

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
    } else if (category == 'new') {
        getURL = api.url + '/shop/new';
    }

    request(getURL, function(err, resp, html, rrr, body) {

        if (!err) {
            if (err) {
                console.log('err')
                return callback('No response from website', null);
            } else {
                var $ = cheerio.load(html);
            }

            var count = $('img').length;

            if ($('.shop-closed').length > 0) {
              return callback('Store Closed', null);
            } else if (count === 0) {
              return callback('Store Closed', null);
            }

            var parsedResults = [];


            // console.log(len);
            $('img').each(function(i, element) {

                var nextElement = $(this).next();
                var prevElement = $(this).prev();
                var image = "https://" + $(this).attr('src').substring(2);
                var title = $(this).attr('alt');
                var availability = nextElement.text().capitalizeEachWord();
                var link = api.url + this.parent.attribs.href;
                var sizesAvailable;


                if (availability == "") availability = "Available";

                request(link, function(err, resp, html, rrr, body) {

                    if (err) {
                        return callback('No response from website', null);
                    } else {
                        var $ = cheerio.load(html);
                    }

                    var addCartURL = api.url + $('form[id="cart-addf"]').attr('action');

                    if (availability == "Sold Out") {
                        addCartURL = null;
                    }

                    var sizeOptionsAvailable = [];
                    if ($('option')) {
                        $('option').each(function(i, elem) {
                            var size = {
                                id: parseInt($(this).attr('value')),
                                size: $(this).text(),
                            }
                            sizeOptionsAvailable.push(size);
                        });

                        if (sizeOptionsAvailable.length > 0) {
                            sizesAvailable = sizeOptionsAvailable
                        } else {
                            sizesAvailable = null
                        }
                    } else {
                        sizesAvailable = null;
                    }

                    var metadata = {
                        title: $('h1').attr('itemprop', 'name').eq(1).html(),
                        style: $('.style').attr('itemprop', 'model').text(),
                        link: link,
                        description: $('.description').text(),
                        addCartURL: addCartURL,
                        price: parseInt(($('.price')[0].children[0].children[0].data).replace('$', '').replace(',', '')),
                        image: image,
                        sizesAvailable: sizesAvailable,
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
        } else {
            return callback('No response from website', null);
        }
    });
};

api.getItem = function(itemURL, callback) {

    request(itemURL, function(err, resp, html, rrr, body) {

        if (err) {
            return callback('No response from website', null);
        } else {
            var $ = cheerio.load(html);
        }

        var sizeOptionsAvailable = [];
        if ($('option')) {
            $('option').each(function(i, elem) {
                var size = {
                    id: parseInt($(this).attr('value')),
                    size: $(this).text(),
                }
                sizeOptionsAvailable.push(size);
            });

            if (sizeOptionsAvailable.length > 0) {
                sizesAvailable = sizeOptionsAvailable
            } else {
                sizesAvailable = null
            }
        } else {
            sizesAvailable = null;
        }

        var availability;
        var addCartURL = api.url + $('form[id="cart-addf"]').attr('action');

        var addCartButton = $('input[value="add to cart"]')
        if (addCartButton.attr('type') == '') {
            availability = 'Available'
        } else {
            availability = 'Sold Out'
        }

        if (availability == 'Sold Out') {
            addCartURL = null
        }

        var metadata = {
            title: $('h1').attr('itemprop', 'name').eq(1).html(),
            style: $('.style').attr('itemprop', 'model').text(),
            link: itemURL,
            description: $('.description').text(),
            addCartURL: addCartURL,
            price: parseInt(($('.price')[0].children[0].children[0].data).replace('$', '').replace(',', '')),
            image: 'http:' + $('#img-main').attr('src'),
            sizesAvailable: sizesAvailable,
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
            metadata.images.push('https:' + $('#img-main').attr('src'))
        }

        callback(null, metadata);
    });
};

api.watchOnAllItems = [];
api.watchAllItems = function(interval, category, callback) {
    api.log('Now watching for all items');
    api.watchOnAllItems = setInterval(function() {
        api.getItems(category, function(items) {
            callback(items, null);
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
    api.getItems(category, (product, err) => {

        if (err) {
            return callback(null, 'Error occured while trying to seek for items.');
        }

        for (i = 0; i < product.length; i++) {
            var title = product[i].title;
            var style = product[i].style;

            if (style === null) {
                // type - style not defined without a match
                if (title.indexOf(keywords) > -1) { // check if the keywords match with the title
                    // found item
                    productLink.push(product[i].link);
                    return callback(product[i], null);
                    break;
                } else {
                    continue;
                }
            } else if (style.indexOf(styleSelection) > -1) {
                // type - style defined with match
                if (title.indexOf(keywords) > -1) { // check if the keywords match with the title
                    // found item
                    productLink.push(product[i].link);
                    return callback(product[i], null);
                    break;
                } else {
                    continue;
                }
            }
        }

        if (productLink[0] === undefined) {
            return callback(null, "Could not find any results matching your keywords.");
        }

    });
}

api.log = function(message) {
    console.log('[supreme api] ' + message);
}

module.exports = api;
