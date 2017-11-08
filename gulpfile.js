const gulp = require('gulp'),
sass = require('gulp-sass'),
fs = require('fs'),
path = require('path'),
useref = require('gulp-useref'),
del = require('del'),
runSequence = require('run-sequence'),
cssnano = require('gulp-cssnano'),
gulpIf = require('gulp-if'),
uglify = require('gulp-uglify'),
glob = require('glob'); //for some reasion the require name here does not match the package name 'node-glob' in package.json

//delete dist folder
gulp.task('clean', () => {
    /*TODO: while the del package is great I want to write my own recursive 
    function to delete directories using node fs module*/
    return del.sync([
        'dist'
    ]);
});

//convert scss files to css files
gulp.task('sass', ['clean'], () => {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

//concatenate css files
// TODO: remove the gulpIf dependency and program a helper function
gulp.task('useref', ['clean', 'sass'], () => {
    return gulp.src('./views/**/*.hjs')
        .pipe(useref({searchPath: './public/'}))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean', 'sass', 'useref'], () => {
    /*Note: one can also use the run-sequence node package to achieve
    the same result as above. An added bonus is that you can watch files
    as well where as explicitely stating task dependencies like above does
    not allow. Run-sequence is based on a hack however and Gulp 4 should
    support running tasks in the proper order out of the box
    */
});