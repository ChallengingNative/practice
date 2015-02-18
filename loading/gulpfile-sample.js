var gulp = require('gulp');
//TODO plugins require
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var copy = require('gulp-copy');
var imagemin = require('gulp-imagemin');

gulp.task('usemin', function() {
    return gulp.src('./fixed/*.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify()]
        }))
        .pipe(gulp.dest('./build/'));
});

gulp.task('copyfonts', function() {
    gulp.src('./fixed/fonts/*.*')
        .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('imagemin', function() {
    gulp.src('./fixed/img/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./build/img/'));
});

gulp.task('default', ['usemin', 'copyfonts', 'imagemin']);