var gulp = require('gulp');

gulp.task('serve', function() {
  var browerSync = require('browser-sync');

  return browerSync.init([
    '*.html',
    'components/**'
  ], {
    server: {
        baseDir: "./"
    }
  });
});


gulp.task('default', function () {
  var concat = require('gulp-concat'),
      merge = require('merge-stream')
      minifyHtml = require('gulp-minify-html'),
      html2js = require('gulp-ng-html2js');

  return merge(
    gulp.src(['bower_components/angular/angular.js', 'bower_components/bower-tagcanvas/tagcanvas.js', 'components/**/*.js']),
    gulp.src('components/tagcloud/tagcloud.html')
      .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(html2js({
        moduleName: "tagcloud",
        declareModule: false,
        prefix: "components/tagcloud/"
      }))
    )
    .pipe(concat('tagcloud.js'))
    .pipe(gulp.dest('../adf/ViewController/public_html/scripts'));
});
