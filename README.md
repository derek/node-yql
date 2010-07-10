node-yql
========

node-yql is a YQL module for NodeJS

What is YQL?
------------

The Yahoo! Query Language is an expressive SQL-like language that lets you query, filter, and join data across Web services. With YQL, apps run faster with fewer lines of code and a smaller network footprint.

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

1) You can clone the github repository

	$ git clone http://github.com/drgath/node-yql.git

2) The easier method is to use [NPM](http://github.com/isaacs/npm), node's package manager.  Once you have NPM installed, simply run:

	$ npm install yql

Use within Node
---------------

A basic example

![](http://s89997654.onlinehome.us/screencaps/untitled-20100710-160828.jpg)
![](http://s89997654.onlinehome.us/screencaps/Default-20100710-160425.jpg)

YQL.exec()
----------

*yql.js* exports a single method, *exec*.

function *exec* (*string* __query__ [, *function* __callback__] [, *object* __params__] [, *object* __options__])

* query - A YQL query
* callback - A callback function that receives the result of the query
* params - Optional parameters for use within the YQL request querystring. Typical uses; including environment files, variable replacement within the YQL statement.
* opts - Options for use within *exec* 
	* https: A boolean true/false to turn on/off HTTPS (default: false)
	* userAgent: A user-agent string (default: *null*)


Additional YQL Resources
------------------------

* Documentation: <http://developer.yahoo.com/yql/guide/>
* Console: <http://developer.yahoo.com/yql/console/>