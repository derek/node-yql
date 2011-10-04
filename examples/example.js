/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

var YQL = require('yql');

// Example #1 - Param binding
new YQL.exec("SELECT * FROM weather.forecast WHERE (location = @zip)", function(response) {

	if (response.error) {
		console.log("Example #1... Error: " + response.error.description);
	} 
	else {
        var location  = response.query.results.channel.location,
            condition = response.query.results.channel.item.condition;
        console.log("Example #1... The current weather in " + location.city + ', ' + location.region + " is " + condition.temp + " degrees and " + condition.text);
	}

}, {"zip": 94089});


// Example #2 - Param binding + SSL
new YQL.exec("select * from twitter.user.timeline where (id = @id)", function(response) {

    if (response.error) {
        console.log(require('util').inspect(error));
        console.log("Example #2... Error: " + response.error.description);
    } 
    else {
        var tweets = response.query.results.statuses.status;
        console.log("Example #2... Latest tweet from @" + tweets[0].user.screen_name + ": " + tweets[0].text);
    }

}, {id:"derek"}, {ssl:true});