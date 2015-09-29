# gulp-graphql
> Keep your graphql schema up-to-date with gulp!
> Made for gulp 3

## Features
* Attempts to generate a graphql schema from `schema.js`
* Can output both `schema.json` and `schema.graphql`
* You MUST pass in graphql, introspectionQuery, and printSchema via `gulpGraphql.init`

## Installation
```shell
npm install gulp-graphql --save-dev
```
## Usage
Example `gulpfile.babel.js`:
```javascript
import gulp from 'gulp';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import { graphql } from 'graphql';
import gulpGraphql from 'gulp-graphql';

// You must initialize gulp-graphql by passing in `graphql`, `introspectionQuery`, and `printSchema`
gulpGraphql.init(graphql, introspectionQuery, printSchema);

gulp.task("schema", () => {
  console.log("Generating graphql schema...");

  return gulp.src("src/data/schema.js")
    .pipe(gulpGraphql())
    .on('error', console.log)
    .pipe(gulp.dest("src/data"))
    .pipe(gulp.dest("dist/data"));
});

gulp.task('watch-schema', () => {
  gulp.watch(serverSchemaFolder, [ 'schema' ]);
});

gulp.task("default", ["schema"]);

```

## Options
* `printSchema` (optional) (default: `true`)
	* Output a readable of `schema.graphql` file
* `generateSchema` (optional) (default: `true`)
	* Generate a graphql schema from your `schema.js` and output to `schema.json`
* `fileName` (optional) (default: `schema`)
	* Base name for your schema file, no extension
* `indentation` (optional) (default: `2`)
	* Takes an `Integer` for indentation spaces of `schema.json`

## Notes
Passing in `graphql` via init is a hack that I'm not thrilled about but seems to work.

## Release log
#### 0.1.0
* Works for me to generate graphql `schema.json` and `schema.graphql` files.

## Licence
MIT License
