
var	sys = require("sys"),
	YQL = require('./yql');

var zip	= 90066;

YQL.exec("SELECT * FROM weather.forecast WHERE location=" + zip, function(response, error) {

	if (!error) {
	
		var	location 	= response.query.results.channel.location,
			condition 	= response.query.results.channel.item.condition;

		sys.puts("The current weather in " + location.city + ', ' + location.region + " is " + condition.temp + " degrees and " + condition.text);
	
	} else {
	
		sys.puts("Error: " + error);
	
	}

});

sys.puts("Fetching weather...");