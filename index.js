'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var defaults = require('lodash.defaults');

var _graphql, _introspectionQuery, _printSchema;

// set local references for
generate.init = function (graphql, introspectionQuery, printSchema) {
  _graphql = graphql;
  _introspectionQuery = introspectionQuery;
  _printSchema = printSchema;
}

function generate (opts) {

  if (!_graphql || !_introspectionQuery || !_printSchema) {
    throw new gutil.PluginError('gulp-graphql',
      'Missing init(graphql, introspectionQuery, printSchema)');
  }

  var options = defaults({}, opts, {
    generateSchema: true,
    printSchema: true,
    indentation: 2,
    fileName: 'schema',
  });

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-graphql', 'Streaming not supported'));
      return;
    }

    var Schema;

    try {
      // delete the schema if it has be loaded previously
      delete require.cache[file.path];
      // require the schema using the file path
      var schema = require(file.path);
      // check if the schema is located on a property
      Schema = schema.Schema || schema.schema || schema;
    } catch (err) {
      this.emit('error',
        new gutil.PluginError('gulp-graphql', err, {
          fileName: file.path,
          message: 'Unable to load schema file',
          showProperties: false
        })
      );
      return this.emit('end');
    }
    if (Schema) {
      var self = this;
      if (options.printSchema) {
        try {
          var printedSchema = _printSchema(Schema);
          if (printedSchema) {
            var printFile = new gutil.File({
              path: options.fileName + '.graphql',
              contents: new Buffer(printedSchema),
            });
            self.push(printFile);
            if (!options.generateSchema) {
              return cb();
            }
          }
        } catch (err) {
          if (!options.generateSchema) {
            this.emit('error',
              new gutil.PluginError('gulp-graphql', err, {
                fileName: file.path,
                message: 'Invalid schema file',
                showProperties: false
              })
            );
            return this.emit('end');
          }
        }
      }

      if (options.generateSchema) {
        _graphql(Schema, _introspectionQuery).then(function (result) {
          if (result.errors) {
            self.emit('error',
              new gutil.PluginError('gulp-graphql', result.errors[0], {
                fileName: file.path,
                showProperties: false
              })
            );
            return self.emit('end');
          }

          var jsonFile = new gutil.File({
            path: options.fileName + '.json',
            contents: new Buffer(
              JSON.stringify(result, null, options.indentation)
            ),
          });
          self.push(jsonFile);
          return cb();
        }).catch(function (err) {
          self.emit('error',
            new gutil.PluginError('gulp-graphql', err, {
              fileName: file.path,
              message: 'Invalid schema file',
              showProperties: false
            })
          );
          return self.emit('end');
        });
      }
    } else {
      return cb();
    }
  });
};

module.exports = generate;
