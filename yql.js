/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

// Include required modules
var request = require('request'),
    url     = require('url');

var baseUrl = {
    http: 'http://query.yahooapis.com/v1/public/yql',
    https: 'https://query.yahooapis.com/v1/public/yql'
};

function extend(origin, add) {    
    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
        origin[keys[i]] = add[keys[i]];
    }
    return origin;
}

function isObject(variable) {
    return typeof variable === 'object' && variable !== null;
}

function parseJSON(string, callback) {
    var result = null,
        error = null;
    try {
        result = JSON.parse(string);
    } catch (e) {
        error = e;
    }

    callback(error, result);
}

function YQL(yqlString, options) {
    if (!(this instanceof YQL)) return new YQL(yqlString, options);

    // yqlString is a required string
    if (typeof yqlString !== 'string') {
        throw new Error('query must be a string');
    }

    // Options is a optional object
    if (!isObject(options) && options !== undefined) {
        throw new Error('options must be a object');
    }

    // Extract options and use there default if not defined
    if (!options) options = {};
    var secure  = options.hasOwnProperty('ssl') ? options.ssl : false,
        headers = options.hasOwnProperty('headers') ? options.headers : {},
        env     = options.hasOwnProperty('env') ? options.env : 'http://datatables.org/alltables.env';

    // Store some options for later reference
    this._headers = headers;

    // Create base url object
    var href = url.parse(baseUrl[secure ? 'https' : 'http'], true);
    delete href.search;
    extend(href.query, {
        format: 'json',
        env:    env,
        q:      yqlString
    });
    this._href = href;
}
module.exports = YQL;

YQL.prototype.exec = function (params, callback) {
    // Params is a required object
    if (!isObject(params)) {
        throw new Error('params must be a object');
    }
    
    // Callback is a required function
    if (typeof callback !== 'function') {
        throw new Error('callback must be a function');
    }

    // Copy url object
    var href = extend({}, this._href);
        href.query = extend({}, this._href.query);

    // Expend query with params object
        href.query = extend(href.query, params);

    // Execute the YQL request
    request({
        headers: this._headers,
        method:  'GET',
        url:     url.format(href)
    }, function(error, response, body) {
        if (error) return callback(error, null);

        parseJSON(body, function (error, body) {
            if (error) return callback(error, null);

            // Request returned an error, create an error object
            if (body.error) return callback(new Error(body.error.description), null);

            // No error return query result
            callback(null, body.query.results);
        });
    });
};
