var yql = require('../lib/yql'),
    request = require('request');

var url = yql.buildUrl("SELECT * FROM weather.forecast WHERE (location = 93063)");

request.get(url.href).pipe(process.stdout);
