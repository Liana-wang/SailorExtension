const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('del');
const ts = require('gulp-typescript');
const path = require('path');
const merge2 = require('merge2');
const through2 = require('through2');
const { transform } = require('@svgr/core')

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

// 将Icons下的svg转换为react组件
function transformSVG(modules) {
    const svgr = gulp
        .src(['src/**/*.@(svg)'])
        .pipe(
            through2.obj(function (file, encoding, next) {
                if (file.path.match(/(\/|\\)svg(\/|\\).*\.svg$/)) {
                    const cloneFile = file.clone();
                    const content = file.contents.toString().replace(/^\uFEFF/, '');

                    cloneFile.contents = Buffer.from(content);

                    const cloneCssFile = cloneFile.clone();

                    transform(
                        cloneCssFile.contents.toString(),
                        {
                            icon: true,
                            expandProps: 'end',
                            exportType: 'named',
                        },
                    ).then(jsCode => {
                        cloneCssFile.contents = Buffer.from(jsCode);
                        cloneCssFile.path = cloneCssFile.path.replace(/\.svg$/, '.svg.js');
                        this.push(cloneCssFile);
                        next();
                    })
                } else {
                    next()
                }
            })
        )
        .pipe(babel(getBabelConfig(modules || false)))
        .pipe(tsConfig())
        .pipe(gulp.dest(modules === false ? ESDIR : LIBDIR));

    return svgr
}

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

gulp.task('svgrEs', () => {
    return transformSVG(false)
})

gulp.task('svgr', () => {
    return transformSVG('commonjs')
})

gulp.task('es', gulp.series(['cleanEs', 'svgrEs'], (done) => {
    console.log('Compile to es...');
    compileFile(false).on('finish', done);
}));

gulp.task('lib', gulp.series(['clean', 'svgr'], (done) => {
    console.log('Compile to js...');
    compileFile('commonjs').on('finish', done);
}));

gulp.task(
    'compile',
    gulp.series('es', 'lib')
);

gulp.task('default', gulp.series('compile'));
