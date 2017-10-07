var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');


requireDir('./gulp/tasks');

gulp.task('watch', function(){
  gulp.watch(['src/assets/css/**/*.{scss,css}'], ['css']);
  gulp.watch('src/assets/js/**/*.js', ['js']);
  gulp.watch('src/assets/glsl/**/*.{vert,frag}', ['glsl']);
  gulp.watch('src/**/*.html', ['html']);
});


gulp.task('predefault', function(){
  runSequence(
    'css',
    'html',
    'glsl',
    'js',
    'browserSync',
    'watch'
  );
});


gulp.task('default', ['predefault'], function(){
  console.log('running default tasks...');
});