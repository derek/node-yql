var	sys = require("sys"),
	YQL = require('./yql');

// Test #1
YQL.exec("SELECT * FROM weather.forecast WHERE (location = @zip)", function(response, error) {

	if (error) {
		sys.puts("Error: " + error);
	} else {
		var	location 	= response.query.results.channel.location,
			condition 	= response.query.results.channel.item.condition;
		sys.puts("Test #1... " + "The current weather in " + location.city + ', ' + location.region + " is " + condition.temp + " degrees and " + condition.text);
	}

}, {"zip": 90066});


// Test #2
YQL.exec("SELECT * FROM weather.forecast WHERE (location = 66213)", function(response, error) {

	if (error) {x
		sys.puts("Error: " + error);
	} else {
		var	location 	= response.query.results.channel.location,
			condition 	= response.query.results.channel.item.condition;
		sys.puts("Test #2... " + "The current weather in " + location.city + ', ' + location.region + " is " + condition.temp + " degrees and " + condition.text);
	}

}, {}, {foo: "bar"});


// Test #3
YQL.exec("select * from twitter.user.timeline where (id = @id)", function(response, error) {

	if (error) {
		sys.puts("Error: " + error);
	} else {	
		var tweets = response.query.results.entry;
		sys.puts("Test #3... " + tweets[0].title);
	}

}, {id:"derek"}, {https:true});