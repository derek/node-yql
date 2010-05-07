var	sys = require("sys"),
	YQL = require('./yql');

// Test #1
new YQL.exec("SELECT * FROM weather.forecast WHERE (location = @zip)", function(response) {

	if (response.error) {
		sys.puts("Error: " + response.error.description);
	} else {
		var	location 	= response.query.results.channel.location,
			condition 	= response.query.results.channel.item.condition;
		sys.puts("Test #1... " + "The current weather in " + location.city + ', ' + location.region + " is " + condition.temp + " degrees and " + condition.text);
	}

}, {"zip": 90066});


// Test #2
new YQL.exec("SELECT * FROM foobar.someTable WHERE (location = 66213)", function(response) {

	if (response.error) {
		sys.puts("Error: " + response.error.description);
	} else {
		// Intentionally blank
	}

}, {}, {foo: "bar"});


// Test #3
new YQL.exec("select * from twitter.user.timeline where (id = @id)", function(response) {

	if (response.error) {
		sys.puts("Error: " + response.error.description);
	} else {	
		var tweets = response.query.results.entry;
		sys.puts("Test #3... Latest tweet from " + tweets[0].title);
	}

}, {id:"derek"}, {https:true});