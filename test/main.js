'use strict';

var graphqlPlugin = require('../');
var fs = require('fs');
var gulp = require('gulp');
var assert = require('stream-assert-gulp');
var gutil = require('gulp-util');
var should = require('should');
var File = gutil.File;

// loading these here prevents a global leak for some reason
var graphql = require('graphql').graphql;
var graphqlUtil = require('graphql/utilities');

var schemaFileSrc = './test/data/schema.js';
var badFileSrc = './test/data/bad.js';
var badSchemaFileSrc = './test/data/database.js';

describe('gulp-graphql', function () {
  describe('graphqlPlugin()', function () {

    it('should not throw when initialized', function (done) {
      (graphqlPlugin).should.not.throw();
      done();
    });

    it('should find the the schema file by src', function (done) {
      gulp.src(schemaFileSrc)
        .pipe(assert.length(1))
        .pipe(assert.all(function(file) {
          (file.isStream()).should.be.false;
        }))
        .pipe(assert.any(function(file) {
            (file.isBuffer()).should.be.true;
          }))
        .on('end', done);
    });

    it('should accept options to only generate a schema.json', function (done) {
      gulp.src(schemaFileSrc)
        .pipe(graphqlPlugin({
          json: true,
          graphql: false,
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(file) {
          (file.isBuffer()).should.be.true;
          (file.isStream()).should.be.false;
          (file.extname).should.equal('.json');
          (file.basename).should.equal('schema.json');
          var jsonSchema = JSON.parse(file.contents.toString());
          (jsonSchema).should.be.an.Object;
          (jsonSchema).should.have.keys('data');
        }))
        .on('end', done);
    });

    it('should accept options to only generate a schema.graphql', function (done) {
      gulp.src(schemaFileSrc)
        .pipe(graphqlPlugin({
          grpahql: true,
          json: false,
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(file) {
          (file.isBuffer()).should.be.true;
          (file.isStream()).should.be.false;
          (file.extname).should.equal('.graphql');
          (file.basename).should.equal('schema.graphql');
        }))
        .on('end', done);
    });

    it('should output 2 files by default', function (done) {
      gulp.src(schemaFileSrc)
        .pipe(graphqlPlugin())
        .pipe(assert.length(2))
        .pipe(assert.first(function(file) {
          (file.isBuffer()).should.be.true;
          (file.isStream()).should.be.false;
          (file.extname).should.equal('.graphql');
        }))
        .pipe(assert.second(function(file) {
          (file.isBuffer()).should.be.true;
          (file.isStream()).should.be.false;
          (file.extname).should.equal('.json');
          var schema = JSON.parse(file.contents.toString());
          (schema).should.be.an.Object;
          (schema).should.have.keys('data');
        }))
        .on('end', done);
    });

    it('should emit an error on invalid file src', function (done) {
      gulp.src(badFileSrc)
        .pipe(graphqlPlugin())
        .on('error', function (err) {
          err.message.should.equal('Unable to load schema file');
        })
        .on('end', done);
    });

    it('should emit an error on invalid schema file', function (done) {
      gulp.src(badSchemaFileSrc)
        .pipe(graphqlPlugin())
        .on('error', function (err) {
          err.message.should.equal('Invalid schema file');
        })
        .on('end', done);
    });
  });
});
