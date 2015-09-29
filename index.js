'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var defaults = require('lodash.defaults');

var graphql, introspectionQuery, printSchema;

// loads graphql via absolute path to base directory
var loadGraphql = function (dirname, options) {
  var src = options.graphqlPath || (dirname + '/node_modules/graphql');
  // console.log(src);

  try {
    graphql = require(src).graphql;
    var graphqlUtil = require(src + '/utilities');
    introspectionQuery = graphqlUtil.introspectionQuery;
    printSchema = graphqlUtil.printSchema;
  } catch (err) {
    throw new gutil.PluginError('gulp-graphql', err, {
      message: 'failed to load graphql from ' + src
    });
  }

  if (!graphql || !introspectionQuery || !printSchema) {
    throw new gutil.PluginError('gulp-graphql',
      'failed to load graphql from ' + src);
  }
};

module.exports = function (opts) {

  var options = defaults({}, opts, {
    json: true,
    graphql: true,
    indentation: 2,
    fileName: 'schema',
  });

  // console.log(options);

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-graphql', 'Streaming not supported'));
      return;
    }

    if (!graphql && file.cwd) {
      loadGraphql(file.cwd, options);
    }

    var Schema;

    try {
      // delete the schema if it has be loaded previously
      delete require.cache[file.path];
      // require the schema using the file path
      var _schema = require(file.path);
      // check if the schema is located on a property
      Schema = _schema.Schema || _schema.schema || _schema;
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
      if (options.graphql) {
        try {
          var printedSchema = printSchema(Schema);
          if (printedSchema) {
            var printFile = new gutil.File({
              path: options.fileName + '.graphql',
              contents: new Buffer(printedSchema),
            });
            self.push(printFile);
            if (!options.json) {
              return cb();
            }
          }
        } catch (err) {
          if (!options.json) {
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

      if (options.json) {
        graphql(Schema, introspectionQuery).then(function (result) {
          if (result.errors) {
            self.emit('error',
              new gutil.PluginError('gulp-graphql', result.errors[0], {
                fileName: file.path,
                message: 'Invalid schema file',
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
