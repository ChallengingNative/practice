Loading time optimization workshop
================================

Given website in ```initial``` folder, try to optimize it`s loading time by implementing steps:

- Concatination (via GULP)
- Minification (via GULP)
- Image sprites (via GULP)
- Images optimization (via GULP)
- Loading order optimization
- Critical path separation (via GUL
 

Steps
-----

- Install NPM and NodeJS from official web site http://nodejs.org/
- Move in your terminal to this folder and initialize NPM ```npm init```, follow instructions and skip steps you do not understand yet
- Install Gulp globally via ```npm install --global gulp```
- And install Gulp for project, saving it as a development dependancy ```npm install gulp --save-dev```
- Create file called ```gulpfile.js``` with content

```
var gulp = require('gulp');
//TODO plugins require

gulp.task('default', function() {
  //TODO task body
});
```
- Check gulp installation by ```gulp``` command
- Install gulp-usemin plugin typing ```npm install gulp-usemin --save-dev```, you may find documentation on Usemin here https://www.npmjs.com/package/gulp-usemin
- Install a the rest of plugins needed: 
	- gulp-uglify
	- gulp-minify-html
	- gulp-minify-css
- Then require plugins in gulpfile.js:

```
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
```
- This will load tasks and define them as JS variables you can use in creating Gulp pipelines
- Next step is defining concatenation targets in our index.html file
- Find place where CSS file are included and wrap it with comments like following:

```
&lt;!-- build:css style.min.css -->
&lt;link href="css/style.css" rel="stylesheet" type="text/css">
&lt;!-- endbuild -->

```

- Do similar with JS files:


```
&lt;!-- build:js js/build.js -->
&lt;script src="js/vendor/jquery-1.11.2.min.js"></script>
&lt;script src="js/vendor/underscore-min.js"></script>
&lt;script src="js/vendor/main.js"></script>
&lt;!-- endbuild -->

```

- Then let`s write the body for Gulp task:

```

return gulp.src('./fixed/*.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify()]
        }))
        .pipe(gulp.dest('./build/'));

```
- This creates new Gulp source from usemin pipe with some specific usemin parameters and then pointing it to destination pipe. Same workflow works for standalone concatenation or minification. Concat task will look like this:

```
return gulp.src('js/**/*.js')
    .pipe(concat('build.js'))
    .pipe(gulp.dest('/buils/js/'));
```

- In order to execute Gulp put ```gulp``` in the terminal. You will see that ```build``` folder created in this lesson`s directory and there we have all css, html, js minified and concatenated
- The only missing part are fonts and images, let`s proceed with them
- As for fonts - we are going just to copy them, for this let`s create one more task ```copyfonts``` as following

```
gulp.task('copyfonts', function() {
    gulp.src('./fixed/fonts/*.*')
        .pipe(gulp.dest('./build/fonts/'));
});
```

- Since we have two tasks now - let`s rename default task to usemin and define ```default``` task as a combination of two by adding:

```
gulp.task('default', ['usemin', 'copyfonts']);
```

- Since we would like to minify traffic, let`s optimize images
- Install ```gulp-imagemin``` and require it as imagemin
- Add task for imagemin and register it as a part of default task:

```
gulp.task('imagemin', function() {
    gulp.src('./fixed/img/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./build/img/'));
});

gulp.task('default', ['usemin', 'copyfonts', 'imagemin']);
```
- Run ```gulp``` we see ```Minified 7 images (saved 49.93 kB - 16.7%)```
- Cool now let think about loading order to speed up minimal experience delivery. Keep CSS in head and move scripts to the most bottom of the body tag then ```gulp``` again.