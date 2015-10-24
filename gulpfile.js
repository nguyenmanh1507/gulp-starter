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
		browserSync = require('browser-sync'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		tinypng = require('gulp-tinypng-compress'),
		autoprefixer = require('gulp-autoprefixer')
;

// SCSS task
gulp.task('sass', function() {

	return gulp.src('app/scss/app.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream())
		;

});


// JSHint task
gulp.task('lint', function() {

	return gulp.src('app/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		;

});

// Reload browser after lint task complete
gulp.task('js-watch', ['lint'], browserSync.reload);

// Image Task
gulp.task('imagemin', function() {

	return gulp.src('app/images/*')
		.pipe(imagemin({
			progressive: true,
			arithmetic: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant(), jpegtran()]
		}))
		.pipe(gulp.dest('dist/images'))
		;

});

// Compress images using tinypng
gulp.task('tinypng', function() {

	return gulp.src('app/images/*.{png,jpg,jpeg}')
		.pipe(tinypng({
			key: 'NkzrC5sBEilVtL9BEAbQ6JGJAVOUJkdf',
			checkSigs: true,
			sigFile: 'images/.tinypng-sigs',
			log: true
		}))
		.pipe(gulp.dest('dist/images'))
		;

});


// Bower task
gulp.task('bower',function() {

	return gulp.src('app/*.html')
		.pipe(wiredep({
			exclude: ['app/bower_components/modernizr/dist/modernizr-build.js', 'app/bower_components/normalize-css/normalize.css']
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

// BrowserSync
gulp.task('serve', function() {
	browserSync.init({
		server: 'app'
	});

	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html').on('change', browserSync.reload);
	gulp.watch('app/js/*.js', ['js-watch']);
});

// Build task
gulp.task('build', ['useref']);

// Default task
gulp.task('default', ['serve']);