exports.exec = function (yql, callback, params, opts) {
	
	var	http = require("http"), sys = require("sys"),
		params = params || {},
		opts = opts || {},
		scheme = "http" + (typeof opts.https != "undefined" &&  opts.https.toString() == "true" ? "s" : ""),
		host = "query.yahooapis.com",
		port = 80,
		path = "/v1/public/yql",
		queryString = '?',
		client, request, url;

	// Attach some paramaters
	params.format = 'json';
	params.q = yql
	if (!params.env) {
		params.env = 'http:/'+'/datatables.org/alltables.env';
	}
	
	// Construct the query string
	for(var key in params) {
		queryString += key + "=" + encodeURIComponent(params[key]) + "&";
	}
	
	// Construct the URL
	url = scheme + "://" + host + path + queryString;
	
	// Create the HTTP Client, and make the request
	client = http.createClient(port, host);
	request	= client.request(
		"GET",
		url,
		{"host": host, "User-Agent": "A Node.js HTTP client"}
	);

	// Handle the response
	request.addListener('response', function (response) {
		
		var responseBody = '';
		
		// Combine the chunks of data as they return
		response.addListener("data", function (chunk) {	
			responseBody += chunk;
		});
		
		// The response is complete
		response.addListener("end", function () {
			// Turn the JSON string into an object, then fire the callback
			var resp = JSON.parse(responseBody);
			if (resp.error) {
				callback(resp, resp.error.description);
			} else {
				callback(resp, false);
			}
		});
	});

	request.end();

};