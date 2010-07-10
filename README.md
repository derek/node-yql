node-yql
========

node-yql is a YQL module for NodeJS

What is YQL?
------------

Via http://developer.yahoo.com/yql/

	The Yahoo! Query Language is an expressive SQL-like language that lets you query, filter, and join data across Web services. With YQL, apps run faster with fewer lines of code and a smaller network footprint.

	Yahoo! and other websites across the Internet make much of their structured data available to developers, primarily through Web services. To access and query these services, developers traditionally endure the pain of locating the right URLs and documentation to access and query each Web service.

	With YQL, developers can access and shape data across the Internet through one simple language, eliminating the need to learn how to call different APIs.

[slides](http://drgath.github.com/talks/20100515_MusicHackday/index.html)

Example YQL Queries
-------------------
SELECT title,abstract FROM search.web WHERE query="pizza";
SELECT * FROM weather.forecast WHERE location = 90066;
SELECT * FROM twitter.user.timeline WHERE id = 'yql';
SELECT * FROM flickr.photos.interestingness(20);

Installing node-yql
-------------------

*node-yql* was written for [node](http://nodejs.org), so make sure you have that installed
first. Once that is installed, you may either clone the github repository

	$ git clone http://github.com/drgath/node-yql.git

Or, the easier method is to use [npm](http://github.com/isaacs/npm), node's package manager.

    $ npm install yql
