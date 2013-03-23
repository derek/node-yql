/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

var assert = require('assert'),
    YQL    = require('../yql.js'),
    query;

// No YQL string
try {
    assert.throws(function () {
        YQL(null);
    }, /^Error: query must be a string$/);
    pass(1);
} catch (e) {
    fail(1, e);
}

// Wrong options object
try {
    assert.throws(function () {
        YQL("SHOW TABLES", null);
    }, /^Error: options must be a object$/);
    pass(2);
} catch (e) {
    fail(2, e);
}

// No param object
try {
    assert.throws(function () {
        var query = YQL("SHOW TABLES");
        query.exec(null);
    }, /^Error: params must be a object$/);
    pass(3);
} catch (e) {
    fail(3, e);
}

// No callback
try {
    assert.throws(function () {
        var query = YQL("SHOW TABLES");
        query.exec({}, null);
    }, /^Error: callback must be a function$/);
    pass(4);
} catch (e) {
    fail(4, e);
}

// Param binding
query = YQL("SELECT * FROM weather.forecast WHERE (location = @zip)");
query.exec({"zip": 90066}, function (error, results) {
    try {
        assert.ifError(error);
        assert.ok(results);
        pass(5);
    } catch(e) {
        fail(5, e);
    }
});

// Param binding + SSL
query = YQL("SELECT * FROM html WHERE url = @url", {ssl: true});
query.exec({url:"http://www.yahoo.com"}, function (error, results) {
    try {
        assert.ifError(error);
        assert.ok(results);
        pass(6);
    } catch(e) {
        fail(6, e);
    }
});

// Non-existent table
query = YQL("SELECT * FROM foobar.badTable");
query.exec({}, function (error, results) {
    try {
        assert.ok(error);
        assert.equal(results, null);
        pass(7);
    } catch(e) {
        fail(7, e);
    }
});

// Missing required fields
query = YQL("SELECT * FROM html");
query.exec({}, function (error, results) {
    try {
        assert.ok(error);
        assert.equal(results, null);
        pass(8);
    } catch(e) {
        fail(8, e);
    }
});

function pass(testID) {
    console.log("Test #" + testID + " ... Passed");
}
function fail(testID, error) {
    console.log("Test #" + testID + " ... FAIL", error);
}
