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
				src: basePaths.src + 'scss/',
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
		gulpLoadPlugins = require('gulp-load-plugins'),
		$ = gulpLoadPlugins(),
		wiredep = require('wiredep').stream,
		del = require('del'),
		browserSync = require('browser-sync'),
		pngquant = require('imagemin-pngquant')
;

// SCSS task
gulp.task('sass', function() {

	return gulp.src('./app/scss/**/*.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.sourcemaps.write('../css'))
		.pipe(gulp.dest('./app/css'))
		.pipe(browserSync.stream())
		;

});


// JSHint task
gulp.task('lint', function() {

	return gulp.src('./app/js/**/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		;

});

// Reload browser after lint task complete
gulp.task('js-watch', ['lint'], browserSync.reload);

// Image Task
gulp.task('imagemin', function() {

	return gulp.src('./app/images')
		.pipe($.imagemin({
			progressive: true,
			arithmetic: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant(), jpegtran()]
		}))
		.pipe(gulp.dest('./app/images'))
		;

});

// Compress images using tinypng
gulp.task('tinypng', function() {

	return gulp.src('./app/images/*.{png,jpg,jpeg}')
		.pipe($.tinypng({
			key: 'NkzrC5sBEilVtL9BEAbQ6JGJAVOUJkdf',
			checkSigs: true,
			sigFile: 'app/images/.tinypng-sigs',
			log: true
		}))
		.pipe(gulp.dest('./app/images'))
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
		.pipe($.gulpif('*.js', $.uglify()))
		.pipe($.gulpif('*.css', $.cssnano()))
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe(gulp.dest('dist'))
		;

});

// Delete files task
gulp.task('del', function() {

	return del('dist/**');

});

// BrowserSync
gulp.task('serve', ['sass', 'js-watch'], function() {
	browserSync.init({
		server: 'app'
	});

	gulp.watch('./app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html').on('change', browserSync.reload);
	gulp.watch('./app/js/**/*.js', ['js-watch']);
});

// Build task
gulp.task('build', ['useref']);

// Default task
gulp.task('default', ['serve']);