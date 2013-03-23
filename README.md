node-yql
========

node-yql is a YQL client for node.js


What is YQL?
------------

Yahoo! Query Language is an expressive SQL-like language that lets you query, filter, and join data across Web services. With YQL, apps run faster with fewer lines of code and a smaller network footprint.

Yahoo! and other websites across the Internet make much of their structured data available to developers, primarily through Web services. To access and query these services, developers traditionally endure the pain of locating the right URLs and documentation to access and query each Web service.

With YQL, developers can access and shape data across the Internet through one simple language, eliminating the need to learn how to call different APIs.

### Example YQL Queries

* SELECT title,abstract FROM search.web WHERE query="pizza";
* SELECT * FROM weather.forecast WHERE location = 90066;
* SELECT * FROM twitter.user.timeline WHERE id = 'yql';
* SELECT * FROM flickr.photos.interestingness(20);

You may find more examples at the [YQL console](http://developer.yahoo.com/yql/console/ "YQL console")


Installing node-yql
-------------------
First, make sure you have Node installed.  You can find instructions for installing it at <http://nodejs.org/#download>

With Node installed, you can install the node-yql module 2 ways: 

1) The easiest method is to use [NPM](http://github.com/isaacs/npm), node's package manager.  Once you have NPM installed, simply run:

	$ npm install yql

2) Or, you can clone the github repository, and just be sure you add this module's path to the $NODE_PATH env variable

	$ git clone http://github.com/drgath/node-yql.git


Use within Node
---------------

A basic example

```javascript
var YQL = require('yql');

YQL("SELECT * FROM weather.forecast WHERE (location = @zip)").exec({"zip": 94089}, function (error, results) {
    if (error) throw error;

    var location  = results.channel.location,
        condition = results.channel.item.condition;
    console.log("The current weather in " + location.city + ', ' +
                location.region + " is " + condition.temp + " degrees and " + condition.text);
});
```

```shell
$ node example.js
The current weather in Sunnyvale, CA is 47 degrees and Fair
```

query = YQL(*string* __query__ [, *object* __options__])
--------------------------------------------------------

* query - A YQL query
* options
  * ssl: A boolean true/false flag to enable HTTPS (default: `false`)
  * headers: Object of valid [HTTP headers](https://secure.wikimedia.org/wikipedia/en/wiki/List_of_HTTP_header_fields) (default `{}`)
  * env: Environment files (default: `http://datatables.org/alltables.env`)


query.exec(*object* __params__, *function* __callback__)
--------------------------------------------------------

* params - Parameters for variable replacement within the YQL statement.
* callback - A callback function that receives the result of the query

Additional YQL Resources
------------------------

* Documentation: <http://developer.yahoo.com/yql/guide/>
* YQL Console: <http://developer.yahoo.com/yql/console/>
