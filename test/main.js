'use strict';

var graphqlPlugin = require('../');
var fs = require('fs');
var gutil = require('gulp-util');
var should = require('should');
var File = gutil.File;

var graphql = require('graphql');
var graphqlUtil = require('graphql/utilities');
var introspectionQuery = graphqlUtil.introspectionQuery;
var printSchema = graphqlUtil.printSchema;

describe('gulp-graphql', function () {
  describe('graphqlPlugin()', function () {
    it('should throw an error if not initialized', function (done) {
      (graphqlPlugin).should.throwError();
      done();
    });

    it('should accept initialization paramaters', function (done) {
      (graphqlPlugin.init.bind(
        graphqlPlugin,
        graphql,
        introspectionQuery,
        printSchema)
      ).should.not.throw();
      done();
    });

    it('should not throw when initialized', function (done) {
      (graphqlPlugin).should.not.throw();
      done();
    });

    it('should have schema tests', function (done) {
      done();
    });
  });
});
