'use strict';

// Define Folder Paths
var basePaths = {
			src: 'app/',
			dest: 'dist/',
			bower: 'app/bower_components/'
		},
		paths = {
			images: {
				src: basePaths.src + 'images/',
				dest: basePaths.dest + 'images/'
			},
			scripts: {
				src: basePaths.src + 'js/',
				dest: basePaths.dest + 'js/'
			},
			styles: {
				src: basePaths.src + 'css/',
				dest: basePaths.dest + 'css/'
			}
		},
		appFiles = {
			styles: paths.styles.src + '**/*.scss',
			scripts: paths.scripts.src + '*.js',
			images: paths.images.src + '*'
		}
;
	

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

	return gulp.src(appFiles.styles)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream())
		;

});


// JSHint task
gulp.task('lint', function() {

	return gulp.src(appFiles.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		;

});

// Reload browser after lint task complete
gulp.task('js-watch', ['lint'], browserSync.reload);

// Image Task
gulp.task('imagemin', function() {

	return gulp.src(appFiles.images)
		.pipe(imagemin({
			progressive: true,
			arithmetic: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant(), jpegtran()]
		}))
		.pipe(gulp.dest(paths.images.dest))
		;

});

// Compress images using tinypng
gulp.task('tinypng', function() {

	return gulp.src(appFiles.images + '.{png,jpg,jpeg}')
		.pipe(tinypng({
			key: 'NkzrC5sBEilVtL9BEAbQ6JGJAVOUJkdf',
			checkSigs: true,
			sigFile: 'app/images/.tinypng-sigs',
			log: true
		}))
		.pipe(gulp.dest(paths.images.dest))
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

	gulp.watch(appFiles.styles, ['sass']);
	gulp.watch('app/*.html').on('change', browserSync.reload);
	gulp.watch(appFiles.scripts, ['js-watch']);
});

// Build task
gulp.task('build', ['useref']);

// Default task
gulp.task('default', ['serve']);