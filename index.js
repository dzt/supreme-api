var cheerio = require('cheerio'),
    request = require('request');

var api = {};

api.url = 'http://www.supremenewyork.com';

String.prototype.capitalizeEachWord = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

api.getItems = function(callback) {
    request(api.url + '/shop/all', function(err, resp, html, rrr, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(html);
            var parsedResults = {
                items: []
            };
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

                    //parsedResults.items.push(metadata);
                    callback(metadata);
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

        callback(metadata);
    });
};

api.watchOnAllItems = [];
api.watchAllItems = function(interval, callback) {
    api.log('Now watching for all items');
    api.watchOnAllItems = setInterval(function() {
      api.getItems(function(items){
          callback(items);
      });
    }, 1000 * interval); // Every xx sec
}

api.stopWatchingAllItems = function(callback) {
    clearInterval(api.watchOnAllItems);
    if (api.watchOnAllItems == "") {
      callback('No watching processes found.');
    } else {
      callback('Watching has stopped.');
    }
}

// searches for new item drop TODO
api.onNewItem = function(callback) {
    api.watchAllItems(function(item) {
        // TODO: If new items is find return callback(value);
    });
}

api.log = function(message) {
    console.log('[supreme api] ' + message);
}

module.exports = api;
