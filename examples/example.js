var	sys = require("sys"),
	YQL = require('yql');

// Test #1
new YQL.exec("SELECT * FROM weather.forecast WHERE (location = @zip)", function(response) {

	if (response.error) {
		sys.puts("Error: " + response.error.description);
	} 
	else {
		var	location 	= response.query.results.channel.location,
			condition 	= response.query.results.channel.item.condition;
		sys.puts("The current weather in " + location.city + ', ' + location.region + " is " + condition.temp + " degrees and " + condition.text);
	}

}, {"zip": 90066});

