exports.exec = function (yql, callback, secure) {
	
	var	client, host, http, request;
	
	http = require("http");
	
	host = "query.yahooapis.com";
	client = http.createClient(80, host);
	request	= client.request(
		"GET",
		"http" + (secure ? "s" : "") + "://" + host + "/v1/public/yql?q=" + encodeURIComponent(yql) + "&format=json",
		{"host": host, "User-Agent": "A Node.js HTTP client"}
	);

	request.addListener('response', function (response) {
		var responseBody = '';
		
		response.setBodyEncoding("utf8");
		
		response.addListener("data", function (chunk) {	
			responseBody += chunk;
		});
		
		response.addListener("end", function () {
			var r = JSON.parse(responseBody);
			if (r.error) {
				callback(r, r.error.description);
			} else {
				callback(r, false);
			}
		});
	});

	request.end();

};