/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

exports.exec = function (yqlQuery, callback, params, httpOpts) {
	
	// Include required modules
	var	request = require('request'),
	    url     = require('url'),
	    util    = require('util');
	    
	// Default the args
	var yqlQuery = yqlQuery || '',
		callback = callback || function(){},
		params   = params   || {},
		httpOpts = httpOpts || {ssl: false};
		
	// Initialize variables used
	var host        = 'query.yahooapis.com',
	    path        = '/v1/public/yql',
	    queryString = '';
	    	
	// Required YQL paramaters
    params.env    = params.env || 'http://datatables.org/alltables.env';
	params.format = 'json';
	params.q      = yqlQuery;
	
	// Construct the querystring
	for (var key in params) {
		queryString += key + '=' + encodeURIComponent(params[key]) + '&';
	}

    // Execute the YQL request and fire the callback
    request({
      headers: httpOpts,
      json   : true,
      method : 'GET',
      url    : url.parse((httpOpts.ssl == true ? 'https' : 'http') + '://' + host + path + '?' + queryString)
    }, function(error, response, body) {
        if (!error) {
            callback(JSON.parse(body));
        }
        else {
            throw 'Something went wrong with an HTTP request';
        }
    });
    
};