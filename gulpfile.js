'use strict';
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin'),
	  notify = require('gulp-notify'),
	  jshint = require('gulp-jshint'),
	  jshintreporter = require('jshint-stylish'),
	  logCapture = require('gulp-log-capture'),
	  karma = require('karma').server,
	  browserSync = require('browser-sync'),
	  livereload = require('gulp-livereload'),
	  uglify = require('gulp-uglify'),
	  removeUseStrict = require("gulp-remove-use-strict"),
	  sourcemaps = require('gulp-sourcemaps'),
	  order = require("gulp-order"),
	  runSequence = require('run-sequence'),
	  concat = require('gulp-concat'),
	  minifycss = require('gulp-minify-css'),
	  rename = require('gulp-rename'),
	  stripCssComments = require('gulp-strip-css-comments'),
	  util = require('gulp-util'),
	  coffee = require("gulp-coffee"),
	  plumber = require('gulp-plumber');
	  //jsdoc = require("gulp-jsdoc");
//var yuidoc = require("gulp-yuidoc");
//var ngdoc = require("gulp-ngdocs");

var config = {
	  bowerfiles:[
	  ],
	  libfirst:[
	  'app/library/jquery/jquery.js',
	  'app/library/angular/angular.js',
	  ],
	  
	  lib:[
	  //'app/scripts/libfist.js',
	  'app/library/**/*.js',
	  //'!app/library/jquery/jquery.js',
	  //'!app/library/angular/angular.js',
	  '!app/library/es5-shim/**/*.js',
	  '!app/library/json3/**/*.js'
	  ],
	  libjs:[
		'app/library/jquery/dist/jquery.js',
		'app/library/modernizr/modernizr.js',
		'app/library/angular/angular.js',
		'app/library/angular-messages/angular-messages.js',
		'app/library/angular-animate/angular-animate.js',
		'app/library/angular-cookies/angular-cookies.js',
		'app/library/angular-sanitize/angular-sanitize.js',
		'app/library/angular-touch/angular-touch.js',
		'app/library/angular-ui-router/release/angular-ui-router.js',
		'app/library/bootstrap/dist/js/bootstrap.js',
		'app/library/lodash/dist/lodash.js'
	  /*
		'app/library/jquery/dist/jquery.min.js',
		'app/library/modernizr/modernizr.min.js',
		'app/library/angular/angular.min.js',
		'app/library/angular-messages/angular-messages.min.js',
		'app/library/angular-animate/angular-animate.min.js',
		'app/library/angular-cookies/angular-cookies.min.js',
		'app/library/angular-sanitize/angular-sanitize.min.js',
		'app/library/angular-touch/angular-touch.min.js',
		'app/library/angular-ui-router/release/angular-ui-router.min.js',
		'app/library/bootstrap/dist/js/bootstrap.min.js',
		'app/library/lodash/dist/lodash.min.js'
		*/
	  ],
	  shims:['app/library/es5-shim/es5-shim.min.js',
	  'app/library/json3/json3.min.js'
	  ],
	  jsfirst:[
	  'scripts/scaffold/extensions.js',
	  'scripts/scaffold/definition.js',
	  'scripts/scaffold/param.js',
	  ''
	  ],
	  js:[
		'app/scripts/**/*.js',
		'app/views/**/*.js',
		'!app/scripts/script.js',
		'!app/scripts/libs.js',
		'!app/scripts/script.min.js',
		'!app/scripts/libs.min.js',
		'!app/scripts/libfist.js',
		'!app/scripts/shim.js'
	  ],
	  css:[
	  'app/library/**/*.css',
	  'app/styles/**/*.css',
	  '!app/styles/style.css'
	  /*
	  'app/library/bootstrap/css/bootstrap.min.css',
	  'app/library/font-awesome/css/font-awesome.min.css',
	  'app/library/bootstrap-progressbar/bootstrap-progressbar-3.2.0.min.css',
	  'app/library/angular-ui-grid/ui-grid-unstable.css',
	  'app/library/angular-loading-bar/loading-bar.css',
	  'app/library/leaflet/leaflet.css',
	  'app/style/base-all.css',
	  'app/style/base.login.css',
	  'app/style/main.css'
	  */
	  ],
	  syncfiles:[
	   'app/views/**/*.html',
       'app/styles/**/*.css',
       'app/scripts/**/*.js'
	  ]
};

/*==============================================================
= library sync
==============================================================*/
gulp.task('librarysync',function(){
	return gulp.src(config.bowerfiles)
	  .pipe($.copy('./app/library'))
	  .pipe(notify({ message: 'librarySync ok.' }));
});

/*==============================================================
= minifyHtml
==============================================================*/
gulp.task('html', function() {
  return gulp.src(['app/**/*.html','!app/bower_components/**/*','!app/library/**/*'])
    .pipe(htmlmin({collapseWhitespace: true,removeComments:true}))
    .pipe(gulp.dest('./dist'))
    .pipe(notify({ message: 'minifyHtml ok.' }));
});

/*==============================================================
= jshint
==============================================================*/
// var myReporter = map(function (file, cb) {
  // if (!file.jshint.success) {
    // console.log('JSHINT fail in '+file.path);
    // file.jshint.results.forEach(function (err) {
      // if (err) {
        // console.log(' '+file.path + ': line ' + err.line + ', col ' + err.character + ', code ' + err.code + ', ' + err.reason);
      // }
    // });
  // }
  // cb(null, file);
// });

gulp.task('jshint', function () {
    return gulp.src(config.js)
      .pipe(jshint())
	  .pipe(logCapture.start(console, 'jshintlog'))
	  //.pipe(jshint.reporter('jslint_xml'))
      .pipe(jshint.reporter(jshintreporter))
	  .pipe(logCapture.stop('xml'))
	  .pipe(gulp.dest('lint-reports'))
	  .pipe(notify({ message:'jshint ok.' }));
});

/*==============================================================
= js
==============================================================*/
gulp.task('js', function() {
  return gulp.src(config.js)
    .pipe(order([
     'app/scripts/scaffold/extensions.js',
	 'app/scripts/scaffold/definition.js',
	 'scripts/scaffold/param.js',
	 'scripts/scaffold/scaffold.js',
	 'scripts/scaffold/data.js',
	 'scripts/config.js',
	 'scripts/base.js',
	 'scripts/app.js',
  ],{ base: './' }))
    .pipe(concat('script.js'))
	.pipe(removeUseStrict())
    .pipe(gulp.dest('app/scripts/package'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'js ok' }));
});

gulp.task('lib', function() {
  return gulp.src(config.lib)
	.pipe(order([
     'app/library/jquery/jquery.js',
	 'app/library/angular/angular.js',
	 'app/library/bootstrap/js/bootstrap.js',
	 'app/ibrary/jstree/jstree.js',
	 'app/library/leaflet/leaflet-src.js'
	],{ base: './' }))
    .pipe(concat('libs.js'))
	//.pipe(removeUseStrict())
    .pipe(gulp.dest('app/scripts/package'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'lib ok' }));
});

/*==============================================================
= shim
==============================================================*/
gulp.task('shim', function() {
   gulp.src(config.shims)
    .pipe(concat('shim.js'))
	.pipe(gulp.dest('app/scripts/package'))
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('dist/scripts'))
	.on('error', util.log)
	.pipe(notify({ message: 'shim ok.' }));
});

/*==============================================================
= css
==============================================================*/
gulp.task('css', function() {
  return gulp.src(config.css)
	.pipe(plumber())
	.pipe(stripCssComments())
    .pipe(concat('style.css'))
	.on('error', util.log)
    .pipe(gulp.dest('./app/styles/package'))
	.pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/styles'))
    .pipe(notify({ message: 'css ok.' }));
});
/*
gulp.task('cssMin', function() {
  return gulp.src(config.css)
	.pipe(plumber())
    .pipe(concat('style.css'))
	.on('error', util.log)
});
*/

/*=================================
=unit test
==================================*/
gulp.task('unittest', function () {
  karma.start({
    configFile: __dirname  + '/test/karma.conf.js',
    singleRun: true
  });
});

/*=================================
=remove-use-strict
==================================*/
var removeUseStrict = require("gulp-remove-use-strict");
gulp.src("./src/*.js")
    .pipe(removeUseStrict())
    .pipe(gulp.dest("./dist"));

/*=================================
=browser-sync
==================================*/
gulp.task('browser-sync', function () {
   browserSync.init(config.syncfiles, {
      server: {
         baseDir: './app'
      }
   });
});

gulp.task('reload', ['browser-sync'], function () {

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(config.syncfiles, [ browserSync.reload]);
});

/*=================================
=livereload
==================================*/
gulp.task('watch', function() {

  gulp.watch(config.css, ['css']);
  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(config.syncfiles).on('change', livereload.changed);
});

/*==============================================================
 = yuidoc
 ==============================================================*/
/*
 gulp.task('yuidoc',function(){
 return gulp.src(config.js)
    .pipe(yuidoc())
    .pipe(gulp.dest('./documentation'))
});
*/

/*==============================================================
 = ngdocs
 ==============================================================*/
 /*
gulp.task('ngdocs', [], function () {
  return gulp.src(config.js)
    .pipe(ngdoc.process())
    .pipe(gulp.dest('./documentation'));
});
*/
/*==============================================================
 = jsdoc
 ==============================================================*/
/*
 gulp.task('jsdoc', function () {
  return gulp.src(config.js)
    .pipe(jsdoc('./documentation'));
});
*/

/*============================================================
=                             Zip                          =
============================================================*/
//gulp.task('zip', function () {
//    gulp.src([SETTINGS.build.app + '*', SETTINGS.build.app + '**/*'])
 //       .pipe(gulpPlugins.zip('build-' + new Date() + '.zip'))
//        .pipe(gulp.dest('./zip/'));
//
//		
//    setTimeout(function () {
//		runSequence('clean:zip');
//    }, 500); // wait for file creation
//	
	    
//});