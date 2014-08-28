/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2010, Yahoo! Inc.
All rights reserved.

*/

var YQL = require('../yql');
var sinon = require('sinon');
var expect = require('expect.js');

describe('YQL', function () {
    describe('constructor', function () {
        it('should return an instance', function () {
            expect(new YQL('foo')).to.be.a(YQL);
        });
        it('should return an instance w/o new', function () {
            expect(YQL('foo')).to.be.a(YQL);
        });

        it('should throw an exception if missing a query', function () {
            expect(function () {
                new YQL();
            }).to.throwError(function (e) {
                expect(e).to.be.a(Error);
            });
        });

        it('should have a query property', function () {
            var myQuery = 'SHOW TABLES';
            expect(new YQL(myQuery).query).to.be.eql(myQuery);
        });

        it('should have a config property with defaults', function () {
            expect(new YQL('SHOW TABLES').config).to.be.eql(YQL.DEFAULT_CONFIG);
        });

        it('should remember custom config properties', function () {
            expect(new YQL('SHOW TABLES', {foo: 'bar'}).config).to.have.property('foo');
        });
    });

    describe('#setParam', function () {
        var yql = new YQL('SHOW TABLES');

        it('should set a param', function () {
            yql.setParam('foo', 'bar');
            expect(yql.params).to.be.eql({foo: 'bar'});
        });

        it('should return itself', function () {
            var value = yql.setParam('foo', 'bar');
            expect(value).to.be(yql);
        });
    });

    describe('#setParams', function () {
        var yql = new YQL('SHOW TABLES');

        it('should set multiple param', function () {
            var params = {
                foo: 'bar',
                baz: 'bop'
            };
            yql.setParams(params);
            expect(yql.params).to.be.eql(params);
        });

        it('should return itself', function () {
            var value = yql.setParams({});
            expect(value).to.be(yql);
        });
    });

    describe('#setConfig', function () {
        var yql = new YQL('SHOW TABLES');

        it('should set a config', function () {
            yql.setConfig('foo', 'bar');
            expect(yql.config).to.have.property('foo');
        });

        it('should return itself', function () {
            expect(yql.setConfig('foo', 'bar')).to.be(yql);
        });
    });

    describe('#setConfigs', function () {
        var yql = new YQL('SHOW TABLES');

        it('should set multiple configs', function () {
            yql.setConfigs({
                foo: 'bar',
                baz: 'bop'
            });

            expect(yql.config).to.have.property('foo');
        });

        it('should return itself', function () {
            expect(yql.setConfigs({})).to.be(yql);
        });
    });

    describe('#getURL', function () {
        var yql = new YQL('SHOW TABLES');

        it('should generate the correct HTTP URL', function () {
            expect(yql.getURL()).to.be('http://query.yahooapis.com/v1/public/yql?format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env&q=SHOW%20TABLES');
        });

        it('should generate the correct HTTPS URL', function () {
            yql.setConfig('ssl', true);
            expect(yql.getURL()).to.be('https://query.yahooapis.com/v1/public/yql?format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env&q=SHOW%20TABLES');
        });
    });

    describe('#exec', function () {

        describe('without a response', function () {

            var yql = new YQL('SHOW TABLES');

            before(function () {
                stub = sinon.stub(yql, '_httpRequest', function (config, callback) {
                    callback();
                })
            });

            after(function () {
                stub.restore();
            });

            it('should throw an error', function () {
                expect(yql.exec.bind(yql)).to.throwError(new RegExp(YQL.ERROR.missingBody));
            });
        });

        describe('with an HTTP error', function () {

            var yql = new YQL('SHOW TABLES');

            before(function () {
                stub = sinon.stub(yql, '_httpRequest', function (config, callback) {
                    callback('This is an error message');
                })
            });

            after(function () {
                stub.restore();
            });

            it('should return an error', function (done) {
                yql.exec(function (error) {
                    expect(error).to.be('This is an error message');
                    done();
                });
            });
        });

        describe('with a parsing error', function () {

            var yql = new YQL('SHOW TABLES');

            before(function () {
                stub = sinon.stub(yql, '_httpRequest', function (config, callback) {
                    callback(null, null, 'this is not valid json');
                })
            });

            after(function () {
                stub.restore();
            });

            it('should respond with an error', function (done) {
                yql.exec(function (error, body) {
                    expect(error).to.be.a(Error);
                    expect(error.message).to.be('Unexpected token h');
                    done();
                });
            });
        });

        describe('with a YQL error', function () {

            var stub;

            var yql = new YQL('SHOW TABLES');

            var response = {
                error: {
                    description: 'This is a YQL error'
                }
            };

            before(function () {
                stub = sinon.stub(yql, '_httpRequest', function (config, callback) {
                    var json = JSON.stringify(response);
                    callback(null, null, json);
                })
            });

            after(function () {
                stub.restore();
            });

            it('should respond with an error', function (done) {
                yql.exec(function (error, body) {
                    expect(error).to.be.a(Error);
                    expect(error.message).to.be(response.error.description);
                    done();
                });
            });
        });

        describe('with a mocked response', function () {

            var yql = new YQL('SHOW TABLES');

            var response = {
                query: {
                    results: {
                        tables: []
                    }
                }
            };

            yql._httpRequest = function (config, callback) {
                var json = JSON.stringify(response);
                callback(null, null, json);
            };

            it('should respond correctly', function (done) {
                yql.exec(function (error, body) {
                    expect(body).to.be.eql(response);
                    done();
                });
            });
        });
    });
});


describe('YQL - Static', function () {
    describe('#exec', function () {
        var stub;
        var response = {
            query: {
                results: {
                    tables: []
                }
            }
        };

        before(function () {
            stub = sinon.stub(YQL.prototype, "_httpRequest", function (config, callback) {
                var json = JSON.stringify(response);
                callback(null, null, json);
            });
        });

        after(function () {
            stub.restore();
        })

        it('should error if no query', function () {
            expect(YQL.exec).withArgs().to.throwError(new RegExp(YQL.ERROR.invalidParameter + ': query'));
        });

        it('should return a response', function (done) {
            YQL.exec('SHOW TABLES', function (results) {
                expect(results).to.be.eql(response);
                done()
            }, {}, {});
        });
    });
});
