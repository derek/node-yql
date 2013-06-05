/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

var assert = require('assert'),
    yql    = require('yql');

// Example #1 - Param binding
new yql.exec("SELECT * FROM weather.forecast WHERE (location = @zip)", function(response) {
    var testID = "1";

    try {
        assert.ok(response.query.results);
        pass(testID);
    }
    catch (e) { return fail(testID, e); }
}, {"zip": 90066});

// Example #2 - Param binding + SSL
new yql.exec("SELECT * FROM html WHERE url = @url", function(response) {
    var testID = "2";
    try {
        assert.ok(response.query.count);
        pass(testID);
    }
    catch (e) { return fail(testID, e); }
}, {url:"http://www.yahoo.com"}, {ssl:true});


// Example #3 - Non-existent table
new yql.exec("SELECT * FROM foobar.badTable", function(response) {
    var testID = "3";
    try {
        // response.error.description will only exist if YQL returns an error
        assert.ok(response.error.description);
        pass(testID);
    }
    catch (e) { return fail(testID, e); }
});


// Example #4 - Missing required fields
new yql.exec("SELECT * FROM html", function(response) {
    var testID = "4";
    try {
        // response.error.description will only exist if YQL returns an error
        assert.ok(response.error.description);
        pass(testID);
    }
    catch (e) { return fail(testID, e); }
});


function pass(testID) {
    console.log("Test #" + testID + " ... Passed");
}
function fail(testID, error) {
    console.log("Test #" + testID + " ... FAIL", error);
}
