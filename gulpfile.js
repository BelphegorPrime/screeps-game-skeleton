let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let ts = require('gulp-typescript');
let babel = require('gulp-babel');

let tsProject = ts.createProject('./tsconfig.json');
let minify = require('gulp-minify');

gulp.task('ts', function() {
    return gulp.src('./src/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});