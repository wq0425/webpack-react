const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'production',// 配置工作模式
    entry: ['./src/index.js', './public/index.html'],// 入口(简写)
    // entry: {
    //     main: './src/js/index.js'
    // },
    output: {// 出口
        path: resolve(__dirname, 'dist'),// 输出路径
        filename: './js/index.js'// 输出的文件名
    },
    module: {
        rules: [
            // 解析less
            {
                test: /\.(less|css)$/,// 匹配所有的less文件
                use: [
                    'style-loader',// 用于在html文档中创建一个style标签，将样式塞进去
                    'css-loader',// 将less编译后的css转换成为Commonjs的一个模块
                    'less-loader'// 将less编译为css，但不生成单独的css文件，在内存中
                ]
            },
            {
                test: /\.js$/,// 匹配所有js文件
                exclude: /node_modules/,// 排除node_modules
                loader: 'eslint-loader',
                options: {}
            },

            // {
            //     test: /\.js$/,// 匹配所有js文件
            //     // exclude: /node_modules/,// 排除node_modules
            //     // enforce: 'pre',// 提前加载使用
            //     // use: {
            //     //     loader: 'eslint-loader'
            //     // }
            // },
            // js语法转换（es6->es5） 
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',// 按需引入需要使用polyfill
                                    corejs: {version: 3},// 解决不能够找到core-js的问题
                                    targets: {// 指定兼容性处理哪些浏览器
                                        'chrome': '58',
                                        'ie': '9'
                                    }
                                }
                            ]
                        ],
                        cacheDirectory: true,// 开启babel缓存
                    }
                }
            },
            // 使用url-loader处理样式文件中的图片
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    // {
                    //     loader: 'url-loader',
                    //     options: {
                    //         limit: 8192
                    //     }
                    // }
                    // {
                    //     loader: 'file-loader',
                    //     options: {
                    //         publicPath: './dist/images',// 决定图片的url路径
                    //         outputPath: 'images',// 决定文件本地输出路径
                    //         name: '[hash:5].[ext]'// 修改文件名称[hsah：5] hash值取5位 [ext]文件扩展名
                    //     }
                    // }
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,// 8kb以下的图片会base64处理
                            publicPath: 'images/',// 决定图片的url路径
                            outputPath: 'images',// 决定文件本地输出路径
                            name: '[hash:5].[ext]'// 修改文件名称[hsah：5] hash值取5位 [ext]文件扩展名
                        }
                    }
                ]
            },
            // 使用html-loader处理html中的标签资源
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader'
                }
            },
            // 使用file-loader处理其他资源
            {
                test: /\.(eot|svg|woff|woff2|ttf|mp3|mp4|avi)$/,// 处理其他资源
                loader: 'file-loader',
                options: {
                    outputPath: 'media',
                    name: '[hash:5].[ext]'
                }
            }
        ]
    },
    // 配置插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',// 以当前文件作为模板创建新的html（1.结构和原来一样2.会自动引入打包的资源）
            favicon: './public/favicon_icon.ico' // ../public/favicon.ico
        })
    ],
    // 关闭---WebPack 警告WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB)
    performance: {
        hints: false
    },
    // 配置自动化编译
    devServer: {
        // open: true,// 自动打开浏览器
        compress: true,// 启动gzip压缩
        port: 3000,// 端口号
        hot: true,// 开启热更新
    },
    // 代码映射，方便调试代码
    devtool: 'cheap-module-eval-source-map'
}