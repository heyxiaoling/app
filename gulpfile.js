// 引入 gulp
var gulp = require('gulp'); 

var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var minifyHtml = require("gulp-minify-html");

gulp.task('html', function () {
    gulp.src('app/*.html') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('app/dist/'));
});

gulp.task('images', function () {
    // 1. 找到图片
    gulp.src('app/images/**/*')
    // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
    // 3. 另存图片
        .pipe(gulp.dest('app/dist/images'))
});


gulp.task('script', function() {
    // 1. 找到文件
    gulp.src('app/res/**/*.js')
    // 2. 压缩文件
        .pipe(uglify())
    // 3. 另存压缩后的文件
        .pipe(gulp.dest('app/dist/res'))
})



// 编译Sass
gulp.task('sass', function() {
    gulp.src('app/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'));
});

gulp.task('css', function () {
    // 1. 找到文件
    gulp.src('app/css/*.css')
    // 2. 压缩文件
        .pipe(minifyCSS())
    // 3. 另存为压缩文件
        .pipe(gulp.dest('app/dist/css'))
})

// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('app/res/*.js', ['script']);
    gulp.watch('app/css/*.css', ['css']);
    gulp.watch('app/images/*.*', ['images']);
    gulp.watch('app/sass/*.scss', ['sass']);
    gulp.watch('app/*.html', ['html']);
})


// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 script 任务和 auto 任务
gulp.task('default', ['html','script', 'css','images','sass','auto'])
