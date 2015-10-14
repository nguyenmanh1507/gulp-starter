'use strict';

var gulp = require('gulp'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		jshint = require('gulp-jshint'),
		wiredep = require('wiredep')
;

// SCSS task
gulp.task('sass', function() {

	return gulp.src('app/scss/app.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/css'))
		;

});


// JSHint task
gulp.task('lint', function() {

	return gulp.src('app/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		;

});

// Bower task
gulp.task('bower',function() {

	return gulp.src('app/*.html')
		.pipe(wiredep({
			exclude: ['app/bower_components/modernizr/dist/modernizr-build.js']
		}))
		.pipe(gulp.dest('app'))
		;

});