/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

var YQL = require('../yql.js');

var query = YQL("SELECT * FROM weather.forecast WHERE (location = @zip)", {ssl:true});

query.exec({"zip": 94089}, function (error, results) {
    if (error) return console.error(error);
    
    var location  = results.channel.location,
        condition = results.channel.item.condition;
    console.log("Example #1... The current weather in " + location.city + ', ' + location.region + " is " + condition.temp + " degrees and " + condition.text);
});
