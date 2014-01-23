/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

// Include required modules
var request = require('request'),
    url     = require('url'),
    YQL     = exports;

YQL.exec = function(yqlQuery, callback, params, httpOpts) {

    if (!yqlQuery) {
        console.error("Error: Missing YQL statement");
    }

    // Default the optional args
    callback = (callback !== undefined ? callback : false);
    params   = (params !== undefined ? params : {});
    httpOpts = (httpOpts !== undefined ? httpOpts : { ssl: false });

    var host = 'query.yahooapis.com',
        path = '/v1/public/yql',
        queryString = '',
        ssl = httpOpts.ssl;

    // Required YQL paramaters
    params.env    = (params.env !== undefined ? params.env : 'http://datatables.org/alltables.env');
    params.format = (params.format !== undefined ? params.format : 'json');
    params.q      = yqlQuery;

    // Construct the querystring
    for (var key in params) {
        queryString += key + '=' + encodeURIComponent(params[key]) + '&';
    }

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
        url:     url.parse((ssl == true ? 'https': 'http') + '://' + host + path + '?' + queryString)
    };

    // Add timeout (in milliseconds) if present in the options
    if (timeout) {
        options.timeout = parseInt(timeout);
    }

    // Execute the YQL request and fire the callback
    request(options, function(error, response, body) {
            callback && callback(error, body);
        }
    );
};
