var gulp        = require('gulp'),
watch           = require('gulp-watch'),
browserSync     = require('browser-sync').create();

gulp.task('watch', () => {

    browserSync.init({
        notify: false,
        server: '.'
    });

    watch('./app/assets/scripts/**/*.js', () => {
        gulp.start('scriptsRefresh');
    });
    
    watch('./app/assets/styles/**/*.css', function() {
        gulp.start('cssInject');
    });
    
    watch('./index.html', function() {
        browserSync.reload();
    });

});

gulp.task('cssInject', ['styles'], function() {
    return gulp.src('./public/styles/style.css')
        .pipe(browserSync.stream());
});

gulp.task('scriptsRefresh', ['scripts'], () => {
    browserSync.reload();
});