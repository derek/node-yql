/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

exports.exec = function (query, callback, params, httpOptions) {
	
	var	http = require("http"),
		https = require("https"),
		params = params || {},
		httpOptions = httpOptions || {},
		host = "query.yahooapis.com",
		path = "/v1/public/yql?",
		secure = (typeof httpOptions.https !== "undefined" && httpOptions.https.toString() === "true" ? true : false),
		protocol = secure ? http : https,
		userAgent = httpOptions.userAgent || "A NodeJS HTTP client",
		client, request;

	// Add some of the required paramaters
	params.format = 'json';
	params.q = query;
	if (!params.env) {
		params.env = 'http:/' + '/datatables.org/alltables.env';
	}
	
	// Add the query string params onto the path
	for (var key in params) {
		path += key + "=" + encodeURIComponent(params[key]) + "&";
	}
	
	var options = {
      host: host,
      path: path,
      "User-Agent": userAgent
    };

    protocol.get(options, function(response) {
        
		var chunks = [];
		
		// Combine the chunks of data as they return
		response.addListener("data", function (chunk) {	
			chunks.push(chunk);
		}).addListener("end", function () {
		    
			// Turn the JSON string into an object, then fire the callback
			var jsonString = chunks.join(''),
				result = JSON.parse(jsonString);
				
			callback(result);
		});

    }).on('error', function(e) {
        
      console.log("Got error: " + e.message);

    });

};