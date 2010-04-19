exports.exec = function(yql, callback, secure){
	
	var http 	= require("http");
	var secure  = secure ? "https://" : "http://";
	var url		= "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yql) + "&format=json";
	
	var client	= http.createClient(80, "query.yahooapis.com");
	var request	= client.request("GET", url, {"host": "query.yahooapis.com", "User-Agent": "NodeJS HTTP Client"});

	request.addListener('response', function (response) {

		var responseBody = '';

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
	
}
