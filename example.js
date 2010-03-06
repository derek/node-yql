
var sys = require("sys");
var YQL = require('./yql');

YQL.get("SELECT * FROM weather.forecast WHERE location=90066", function(response) {
	
	var location 	= response.query.results.channel.location,
		condition 	= response.query.results.channel.item.condition;
	
	sys.puts("The current temperature in " + location.city + " is " + condition.temp + " degrees");
	
});
