'use strict';

var gulp = require('gulp'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		jshint = require('gulp-jshint'),
		wiredep = require('wiredep').stream,
		useref = require('gulp-useref'),
		del = require('del'),
		gulpif = require('gulp-if'),
		uglify = require('gulp-uglify'),
		minifyCss = require('gulp-minify-css'),
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

// Useref task
gulp.task('useref', ['del'], function() {

	var assets = useref.assets();

	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist'))
		;

});

// Delete files task
gulp.task('del', function() {

	return del('dist/**');

});