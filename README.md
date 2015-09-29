# gulp-graphql
> Keep your graphql schema up-to-date with gulp!
> Made for gulp 3

## Features
* Attempts to generate a graphql schema from `schema.js`
* Can output both `schema.json` and `schema.graphql`
* You MUST pass in `graphql`, `introspectionQuery`, and `printSchema` via `.init()`

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
import schema from 'gulp-graphql';

// You must initialize gulp-graphql by passing
// in `graphql`, `introspectionQuery`, and `printSchema`
schema.init(graphql, introspectionQuery, printSchema);

gulp.task("schema", () => {
  console.log("Generating graphql schema...");

  return gulp.src("src/data/schema.js")
    .pipe(schema({
      json: true,
      graphql: false,
    }))
    .on('error', console.log)
    .pipe(gulp.dest("src/data"))
    .pipe(gulp.dest("dist/data"));
});

gulp.task('watch-schema', () => {
  gulp.watch("src/data/schema.js", [ 'schema' ]);
});

gulp.task("default", ["schema"]);

```

## Options
* `json` (optional) (default: `true`)
	* Generate a graphql schema from your `schema.js` and output to `schema.json`
* `graphql` (optional) (default: `true`)
	* Output schema as a readable `schema.graphql` file
* `fileName` (optional) (default: `schema`)
	* Base name for your schema file, no extension
* `indentation` (optional) (default: `2`)
	* Takes an `Integer` for indentation spaces of `schema.json`

## Notes
Passing in `graphql` via init is a hack that I'm not thrilled about but seems to work.

## Release log
#### 0.1.0
* Generates graphql `schema.json` and `schema.graphql` files w/ tests.

## Licence
MIT License
