![build status](https://travis-ci.org/derek/node-yql.svg?branch=master)

# node-yql

node-yql is a YQL client for node.js

## What is YQL?

Yahoo! Query Language is an expressive SQL-like language that lets you query, filter, and join data across Web services. With YQL, apps run faster with fewer lines of code and a smaller network footprint.

Yahoo! and other websites across the Internet make much of their structured data available to developers, primarily through Web services. To access and query these services, developers traditionally endure the pain of locating the right URLs and documentation to access and query each Web service.

With YQL, developers can access and shape data across the Internet through one simple language, eliminating the need to learn how to call different APIs.

### Example YQL Queries

* SELECT title,abstract FROM search.web WHERE query="pizza";
* SELECT * FROM weather.forecast WHERE location = 90066;
* SELECT * FROM twitter.user.timeline WHERE id = 'yql';
* SELECT * FROM flickr.photos.interestingness(20);

You may find more examples at the [YQL console](http://developer.yahoo.com/yql/console/ "YQL console")


## Installing node-yql

    $ npm install yql


## Example

	var YQL = require('yql');
	var query = new YQL('SHOW TABLES');
	query.exec(function (error, response) {
		// Do something with results (response.query.results)
	});

You can also chain the methods:

	YQL('SELECT * FROM weather.forecast WHERE (location = @zip)').setParam('zip', 94089).setConfig('ssl', true).exec(fn)

## Documentation
Full documentation can be found at [derek.github.com/node-yql](http://derek.github.com/node-yql)


function *YQL* (*string* __query__ [, *object* __options__])

* `query` - A YQL query
* `options`
    * `ssl`: A boolean true/false flag to enable HTTPS (default: `false`)
    * `headers`: Object of valid [HTTP headers](https://secure.wikimedia.org/wikipedia/en/wiki/List_of_HTTP_header_fields) (default `{}`)
    * `env`: Environment files (default: `http://datatables.org/alltables.env`)


## Additional YQL Resources

* Documentation: <http://developer.yahoo.com/yql/guide/>
* YQL Console: <http://developer.yahoo.com/yql/console/>
