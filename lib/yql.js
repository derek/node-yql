exports.exec = function (query, callback, params, opts) {
	
	var	http = require("http"),
		params = params || {},
		opts = opts || {},
		host = "query.yahooapis.com",
		path = "/v1/public/yql?",
		secure = (typeof opts.https !== "undefined" && opts.https.toString() === "true" ? true : false),
		port = secure ? 443 : 80,
		userAgent = opts.userAgent || "A NodeJS HTTP client",
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
	
	// Create the HTTP Client, and make the request
	client = http.createClient(port, host, secure);
	request	= client.request("GET", path, {"host": host, "User-Agent": userAgent});

	// Handle the response
	request.addListener('response', function (response) {
		
		var chunks = [];
		
		// Combine the chunks of data as they return
		response.addListener("data", function (chunk) {	
			chunks.push(chunk);
		});
		
		// The response is complete
		response.addListener("end", function () {
			// Turn the JSON string into an object, then fire the callback
			var jsonString = chunks.join(''),
				result = JSON.parse(jsonString);
				
			callback(result);
		});
		
	});

	request.end();

};