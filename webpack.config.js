const path = require('path')
// webpack.config.js
var HelloWorldPlugin = require('./plugins/test1')
var WelcomePlugin = require('./plugins/test2')
module.exports = {
    entry: {
        index: './example/entry.js'
    }, // 入口，默认值
    output: {
        filename: "[name].bundle.js", // [name/hash/chunkhash/id/contenthash/query]
        path: __dirname + '/dist', // 生成路径
        publicPath: "",  // cdn路径
        library: 'myLib',
        libraryTarget: 'var', // 导出类型  "var" | "module" | "assign" | "this" | "window" | "self" | "global" | "commonjs" | "commonjs2" | "commonjs-module" | "amd" | "amd-require" | "umd" | "umd2" | "jsonp" | "system"
        //                              暴露为变量|         |暴露为全局变量|作为this/window/self/的一个属性            | commomjs模块 |output.library无效|                                      |全能选手|
        auxiliaryComment: { // 为各种导出类型添加注释
            root: 'Root Comment',
            commonjs: 'CommonJS Comment',
            commonjs2: 'CommonJS2 Comment',
            amd: 'AMD Comment'
        },
    },
    mode: 'production', // 'production'/'development'/'none'
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: [
                    {
                        loader: path.resolve('loader/test1.js'),
                        options: {/* ... */ }
                    }, {
                        loader: 'html-loader',
                    }
                ]
            }
        ]
    },
    plugins: [
        new HelloWorldPlugin({ options: true }),
        new WelcomePlugin({ options: true })
    ]
}