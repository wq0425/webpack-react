// 生产环境
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: 'production',// 配置工作模式
    entry: ['./src/index.js', './public/index.html'],// 入口(简写)
    // entry: {
    //     main: './src/js/index.js'
    // },
    output: {// 出口
        path: path.resolve(__dirname, '../dist'),// 输出路径
        filename: './js/index.js',// 输出的文件名
        publicPath: ''// 所有输出资源在引入时的公共路径
    },
    module: {
        rules: [
            // 解析less
            {
                test: /\.(less|css)$/,// 匹配所有的less文件
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',// 用于在html文档中创建一个style标签，将样式塞进去
                    'css-loader',// 将less编译后的css转换成为Commonjs的一个模块
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),// 用于控制flex   4.2.1
                                require('postcss-preset-env')({
                                    autoprefixer: {
                                        flexbox: 'no-2009'// 静止使用2009语法
                                    },
                                    stage: 3
                                }),
                                require('postcss-normalize')(),// 使老旧浏览器兼容更好
                            ],
                            sourceMap: true
                        }
                    },
                    // 'less-loader'// 将less编译为css，但不生成单独的css文件，在内存中
                    {
                        loader: 'less-loader',// 将less编译为css，但不生成单独的css文件，在内存中
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            //   sourceMap: true,
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[path][name]__[local]--[hash:base64:5]'
                            }
                        }
                    },
                    "sass-loader"
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
                            publicPath: '../images',// 决定图片的url路径
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
        new copyWebpackPlugin({
            patterns: [{//复制static到dist
                from: path.resolve(__dirname, '../src/static'),//打包的静态资源目录地址
                to: './static' //打包到dist下面的static
            }]
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',// 以当前文件作为模板创建新的html（1.结构和原来一样2.会自动引入打包的资源）
            favicon: path.resolve('./public/favicon_icon.ico') ,
            minify: {
                removeComments: true,// 移除注释
                collapseWhitespace: true,// 折叠所有留白
                removeRedundantAttributes: true,// 移除无用的标签
                useShortDoctype: true,// 使用短的文档声明
                removeEmptyAttributes: true,// 移除空标签
                removeStyleLinkTypeAttributes: true,// 移除rel="stylesheet"
                keepClosingSlash: true,// 自结束
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        // 清空打包文件目录
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[hash:5].css'
        }),
        //压缩css
        new OptimizeCssAssetsPlugin({
            cssProcessorPluginOptions: {
                preset: [// preset解析
                    'default',// 使用默认规则
                    { 
                        discardComments: { 
                            removeAll: true,// 移除所有css的注释
                        }
                    }
                ]
            },
            cssProcessorOptions: {// 解决没有source map问题
                map: {
                    inline: false,
                    annotation: true
                }
            }
        })
    ],
    // devtool: "eval",	// 禁用sourceMap
    // 代码映射，方便调试代码
    devtool: 'cheap-module-source-map'
}