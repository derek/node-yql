/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

// Include required modules
var request = require('request'),
    url     = require('url'),
    YQL     = exports;

YQL.buildUrl = function(yqlQuery, params, ssl) {
    params   = (params !== undefined ? params : {});
    ssl      = ssl || false;
    
    var host = 'query.yahooapis.com',
        path = '/v1/public/yql',
        queryString = '';

    // Required YQL paramaters
    params.env    = (params.env !== undefined ? params.env : 'http://datatables.org/alltables.env');
    params.format = (params.format !== undefined ? params.format : 'json');
    params.q      = yqlQuery;

    // Construct the querystring
    for (var key in params) {
        queryString += key + '=' + encodeURIComponent(params[key]) + '&';
    }

    return url.parse((ssl == true ? 'https': 'http') + '://' + host + path + '?' + queryString);
};

YQL.exec = function(yqlQuery, callback, params, httpOpts) {

    if (!yqlQuery) {
        console.error("Error: Missing YQL statement");
    }

    // Default the optional args
    callback = (callback !== undefined ? callback : false);
    httpOpts = (httpOpts !== undefined ? httpOpts : { ssl: false });

    var ssl = httpOpts.ssl;

    // Delete httpOpts.ssl as we already reassigned it and don't want stray HTTP headers
    delete httpOpts.ssl;

    var timeout = httpOpts.timeout || null;
    if (timeout) {
        delete httpOpts.timeout;
    }

    var options = {
        headers: httpOpts,
        json:    true,
        method:  'GET',
        url: YQL.buildUrl(yqlQuery, params, ssl)
    };

    // Add timeout (in milliseconds) if present in the options
    if (timeout) {
        options.timeout = parseInt(timeout);
    }

    // Execute the YQL request and fire the callback
    request(options, function(error, response, body) {
            if (!error) {
                if (callback) callback((body));
            } else if (error && error.code == 'ETIMEDOUT') {
                if (callback) callback(error.code);
            }
            else {
                throw 'Something went wrong with an HTTP request';
            }
        }
    );
};
