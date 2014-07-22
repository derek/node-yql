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
    return YQL.exec2(yqlQuery, params, httpOpts, function(err, body) {
        if (!err) {
            if (callback) callback((body));
        } else if ((!!err) && (err.code == 'ETIMEDOUT')) {
            if (callback) callback(err.code);
        }
        else {
            throw 'Something went wrong with an HTTP request';
        }
    });
};

YQL.exec2 = function(yqlQuery, params, httpOpts, callback) {
    // Default the optional args
    params   = (params !== undefined ? params : {});
    httpOpts = (httpOpts !== undefined ? httpOpts : { ssl: false });
    callback = (callback !== undefined ? callback : false);
    
    if (!yqlQuery) { 
        if (callback) callback(new Error('missing YQL statement'));
        return;
    }

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
        url:     url.parse((ssl === true ? 'https': 'http') + '://' + host + path + '?' + queryString)
    };

    // Add timeout (in milliseconds) if present in the options
    if (timeout) {
        options.timeout = parseInt(timeout);
    }

    // Execute the YQL request and fire the callback
    request(options, function(err, response, body) {
            if (callback) callback(err, body);
        }
    );
};
