const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('del');
const ts = require('gulp-typescript');
const merge2 = require('merge2');

const getBabelConfig = require('../../configs/getBabelConfig')
const tsConfig = ts.createProject('./tsconfig.json');
const ESDIR = './es';
const LIBDIR = './lib';

gulp.task('clean', () => {
    return clean(['lib']);
});

gulp.task('cleanEs', () => {
    return clean(['es']);
});

function compileFile(modules) {
    const babelConfig = getBabelConfig(modules || false);

    // 编译ts为js
    const tsResult = tsConfig.src().pipe(tsConfig());

    // babel
    const tsFilesStream = tsResult.js.pipe(babel(babelConfig)).pipe(gulp.dest(modules === false ? ESDIR : LIBDIR));

    // 类型声明
    const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? ESDIR : LIBDIR));

    return merge2([tsFilesStream, tsd]);
}

gulp.task('es', gulp.series(['cleanEs'], (done) => {
    console.log('Compile to es...');
    compileFile(false).on('finish', done);
}));

gulp.task('lib', gulp.series(['clean'], (done) => {
    console.log('Compile to js...');
    compileFile('commonjs').on('finish', done);
}));

gulp.task(
    'compile',
    gulp.series('es', 'lib')
);

gulp.task('default', gulp.series('compile'));
