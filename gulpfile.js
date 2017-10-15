var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');


requireDir('./gulp/tasks');

gulp.task('media', function()
{

  gulp.src("src/**/*.txt")
    .pipe(gulp.dest("dst"));
});

gulp.task('watch', function(){
  gulp.watch(['src/assets/css/**/*.{scss,css}'], ['css']);
  gulp.watch('src/assets/js/**/*.js', ['js']);
  gulp.watch('src/assets/glsl/**/*.{vert,frag}', ['glsl']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.txt', ['media']);
});


gulp.task('predefault', function(){
  runSequence(
    'css',
    'html',
    'glsl',
    'js',
    'media',
    'browserSync',
    'watch'
  );
});


gulp.task('default', ['predefault'], function(){
  console.log('running default tasks...');
});