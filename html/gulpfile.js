var gulp = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
    browserSync.init([
        '*.html'
      ], {
        server: {
            baseDir: "./"
        }
      });
});

gulp.task('serve', ['browser-sync'], function () {
  gulp.watch('./*.html', browserSync.reload());
});
