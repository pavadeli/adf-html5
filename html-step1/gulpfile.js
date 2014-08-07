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


gulp.task('tagcloud', function () {
  var concat      = require('gulp-concat'),
      streamqueue = require('streamqueue'),
      minifyHtml  = require('gulp-minify-html'),
      html2js     = require('gulp-ng-html2js');

  var stream = streamqueue({ objectMode: true });

  stream.queue(gulp.src(['bower_components/angular/angular.js', 'bower_components/bower-tagcanvas/tagcanvas.js', 'components/tagcloud/tagcloud.js']));

  stream.queue(gulp.src('components/tagcloud/tagcloud.html')
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(html2js({
      moduleName: "tagcloud",
      declareModule: false,
      prefix: "components/tagcloud/"
    })));

  return stream.done()
    .pipe(concat('tagcloud.js'))
    .pipe(gulp.dest('../adf/ViewController/public_html/scripts'));
});



gulp.task('default', ['tagcloud']);