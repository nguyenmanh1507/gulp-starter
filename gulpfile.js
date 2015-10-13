'use strict';

var gulp = require('gulp'),
		sass = require('gulp-sass')
;

// SCSS task
gulp.task('sass', function() {

	return gulp.src('app/scss/app.scss')
		.pipe(sass().on('error', sass.logErorr))
		.pipe(gulp.dest('app/css'))
		;

});