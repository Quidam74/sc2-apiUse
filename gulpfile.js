var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');


var source = './src'; // dossier de travail
var destination = './web'; // dossier à livrer


gulp.task('serve', () => {
    browserSync({
        notify: true,
        port: 1337,
        server: {
            baseDir: './' + destination + '/',
            index: "index.html"
        }
    });
});

gulp.task('init', function () {
    html();
    sassCompile();
    return jsCompile();
});


function sassCompile() {
    return gulp.src(source + "/scss/main.scss")
        .pipe(sass())    // ici on utilise gulp-sass
        .pipe(gulp.dest(destination + '/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
    }

    function html() {
        return gulp.src('./' + source + '/**/*.html')
        .pipe(gulp.dest('./' + destination + '/'))
        .pipe(browserSync.reload({
            stream: true
        }))
    }

    function jsCompile() {
        return gulp.src('./' + source + '/js/main.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('./' + destination + '/js/'))
        .pipe(browserSync.reload({
            stream: true
        }))
    }

    gulp.task('watch', function () {
        gulp.watch(source + '/scss/**', sassCompile);
        gulp.watch(source + '/**/*.html', html);
        gulp.watch(source + '/js/**', jsCompile);
    });


    gulp.task('cron',gulp.parallel('serve','watch'));

    gulp.task('dev', gulp.series('init', 'cron'));
