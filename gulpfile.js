var uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    gulp   = require('gulp');

gulp.task('dist', function() {
  var path  = ['src/stats_gopher.js', 'src/stats_gopher.presence_monitor.js'];

  gulp.src(path).pipe(uglify({ outSourceMap: true }))
                .pipe(concat('stats-gopher.min.js'))
                .pipe(gulp.dest('dist/'));

  gulp.src(path).pipe(concat('stats-gopher.js'))
                .pipe(gulp.dest('dist/'));
});
