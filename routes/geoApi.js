/**
 * Created by vishah on 3/2/2015.
 */

var apiRouter = require('express').Router();
var restify = require('restify');

/* Create the module scoped JSON client for Geo API */
var client = restify.createJsonClient( {
    url: 'http://api.geonames.org'
});

/* Get Geo API JSON Data */
apiRouter.get('/', function(req, res, next) {
    var searchId = req.query.geoId;
    client.get('/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=eqxdemo', function(err, req_, res_, obj) {
        if(searchId) {
            var search = obj.geonames.slice(0);
            while (obj = search.shift()) {
                if(obj.countrycode == searchId) {
                    res.send(obj);
                }
                if(obj.children) {
                    search.push.apply(search, obj.children);
                }
            }
            // Since it exited While, the match wasn't found.. Throw Error.
            res.status(404);
            res.render('error', {
                message: 'Search Criteria Did not match',
                error: {}
            });
        } else {
            res.send(obj);
        }
    });
});

module.exports = apiRouter;
