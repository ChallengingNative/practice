var gulp = require('gulp');
//TODO plugins require
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');

gulp.task('default', function() {
    return gulp.src('./fixed/*.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify()]
        }))
        .pipe(gulp.dest('./build/'));
});