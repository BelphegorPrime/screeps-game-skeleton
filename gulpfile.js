let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let ts = require('gulp-typescript');
let tsProject = ts.createProject('./tsconfig.json');
let babel = require('gulp-babel');
let webpack = require('gulp-webpack');
let rename = require("gulp-rename");

gulp.task('ts', function() {
    return gulp.src("src/*.ts")
        .pipe(tsProject())
        .pipe(babel())
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(rename("main.js"))
        .pipe(gulp.dest('./dist'));
});