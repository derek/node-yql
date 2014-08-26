/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

var request = require('request');
var url = require('url');
var _ = require('underscore');

/**
 * YQL constructor
 *
 * @example
 *   `var query = new YQL('SHOW TABLES');`
 *
 * @module YQL
 * @class YQL
 * @param {String} query A YQL query
 * @param {Object} [config] A hash of configuration options
 * @public
 * @constructor
 */
function YQL (query, config) {
    config = config || {};

    if (!query) {
        throw new Error(YQL.ERROR.missingQuery);
    }

    if (!(this instanceof YQL)) {
        return new YQL(query, config);
    }

    /**
     * The YQL query string
     *
     * @property query
     * @public
     * @type {String}
     */
    this.query = query;

    /**
     * A hash of values to replace in the query
     *
     * @property params
     * @public
     * @type {Object}
     */
    this.params = {};

    /**
     * A hash of configuration options
     *
     * @property config
     * @public
     * @type {Object}
     */
    this.config = _.defaults(config, YQL.DEFAULT_CONFIG);
}

/**
 * Sets a variable value for use in the YQL query
 *
 * @example
 *   `query.setParam('name', 'derek');`
 *
 * @method setParam
 * @public
 * @chainable
 * @param key {String}
 * @param value {String}
 * @return {Object} This instance
 */
YQL.prototype.setParam = function (key, value) {
    this.params[key] = value;
    return this;
};

/**
 * Sets an array of variable values for use in the YQL query
 *
 * @example
 *   ```
 *   query.setParams({
 *     city: 'San Francisco',
 *     state: 'CA'
 *   });
 *   ```
 *
 * @method setParams
 * @public
 * @chainable
 * @param params {Object}
 * @return {Object} This instance
 */
YQL.prototype.setParams = function (params) {
    this.params = _.extend(this.params, params);
    return this;
};

/**
 * Sets a YQL option
 *
 * @example
 *   `query.setOption('ssl', true);`
 *
 * @method setOption
 * @public
 * @chainable
 * @param key {String}
 * @param value {String}
 * @return {Object} This instance
 */
YQL.prototype.setConfig = function (key, value) {
    this.config[key] = value;
    return this;
};

/**
 * Sets a batch of YQL options
 *
 * @example
 *   ```
 *   query.setOptions({
 *     env: 'http://example.com/path/to/my.env',
 *     headers: {'User-Agent': 'request'},
 *     ssl: true,
 *     timout: 500
 *   });
 *   ```
 *
 * @method setOptions
 * @public
 * @chainable
 * @param options {Object}
 * @return {Object} This instance
 */
YQL.prototype.setConfigs = function (config) {
    this.config = _.extend(this.config, config);
    return this;
};

/**
 * Gets the URL object of the HTTP request
 *
 * @example
 *   ```
 *   var url = query.getURL()
 *   ```
 * @method getURL
 * @public
 * @return {String} URL
 */
YQL.prototype.getURL = function () {
    var baseURL = this.config.baseURL[this.config.ssl ? 'https' : 'http'];

    // Create base url object
    var urlObj = url.parse(baseURL, true);

    // delete urlObj.search
    _.extend(urlObj.query, {
        format: 'json',
        env: this.config.env,
        q: this.query
    });

    // Extend query with params object
    urlObj.query = _.extend({}, urlObj.query, this.params);

    this._urlObj = urlObj;

    return urlObj.format();
};

/**
 * Executes the query
 *
 * @example
 *   ```
 *   var query = new YQL(yqlQuery);
 *   query.exec(callbackFn)
 *   ```
 * @method exec
 * @param {Function} [callback] A function to be executed with arguments `(error, response)`.
 * @public
 */
YQL.prototype.exec = function (callback) {
    var url = this.getURL();
    var config = {
        headers: this.config.headers,
        method: 'GET',
        timeout: parseInt(this.config.timeout, 10),
        url: url
    };

    var handler = this._handleResponse.bind(this, callback);

    // Execute the YQL request
    this._httpRequest(config, handler);
};

/**
 * Executes an HTTP request (via Request).
 *
 * @method _httpRequest
 * @private
 */
YQL.prototype._httpRequest = function () {
    request.apply(null, arguments)
};

/**
 * The YQL#exec response handler
 *
 * @method _handleResponse
 * @private
 */
YQL.prototype._handleResponse = function (callback, error, response, body) {
    if (error) {
        return callback(error);
    }

    if (body) {
        parseJSON(body, function (error, body) {

            if (error) {
                return callback(error, null);
            }

            error = null;

            // Request returned an error, create an error object
            if (body.error) {
                error = new Error(body.error.description);
            }

            if (callback) {
                callback(error, body);
            }
        });
    }
    else {
        throw new Error(YQL.ERROR.missingBody, null);
    }
};


/**
 * The original API, for backwards compatibility
 *
 * @method exec
 * @public
 * @static
 * @deprecated
 * @param {Object} query
 * @param {Object} params
 * @param {Object} options
 * @param {Object} callback Arguments: `(response)`
 */
YQL.exec = function (query, callback, params, config) {
    if (typeof query !== 'string') {
        throw new Error(YQL.ERROR.invalidParameter + ': query')
    }

    return YQL(query).setParams(params).setConfigs(config).exec(function (error, results) {
        if (error) {
            results = results || {};
            results.error = results.error || {};
            results.error.description = error.code;
        }
        callback(results)
    });
};

/**
 * A default configuration object
 *
 * @property DEFAULT_CONFIG
 * @public
 * @static
 * @type {Object}
 */
YQL.DEFAULT_CONFIG = {
    baseURL: {
        http: 'http://query.yahooapis.com/v1/public/yql',
        https: 'https://query.yahooapis.com/v1/public/yql'
    },
    env: 'http://datatables.org/alltables.env',
    headers: {},
    ssl: false,
    timeout: 0 // 0 = No timeout
};

/**
 * A hash of error messages
 *
 * @property ERROR
 * @private
 * @static
 * @type {Object}
 */
YQL.ERROR = {
    missingQuery: 'Missing YQL query',
    missingBody: 'Missing response body',
    invalidParameter: 'Missing or invalid parameter'
};

module.exports = YQL;

/* Utilities */

/**
 * Gracefully parse JSON
 *
 * @method parseJSON
 * @param {String} string
 * @param {Function} callback
 * @private
 */
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
