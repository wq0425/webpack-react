const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");// 测量各个插件和loader所花费的时间
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AntDesignThemePlugin = require("antd-theme-webpack-plugin");
const copyWebpackPlugin = require('copy-webpack-plugin');


const smp = new SpeedMeasurePlugin();



// const options = {
//     antDir: path.join(__dirname, "./node_modules/ant"), //antd包位置
//     stylesDir: path.join(__dirname, "./src/styles/theme"), //主题文件所在文件夹
//     varFile: path.join(__dirname, "./src/styles/theme/variables.less"), // 自定义默认的主题色
//     mainLessFile: path.join(__dirname, "./src/styles/theme/index.less"), // 项目中其他自定义的样式（如果不需要动态修改其他样式，该文件可以为空）
//     outputFilePath: path.join(__dirname, "./public/color.less"), //提取的less文件输出到什么地方
//     themeVariables: ["@primary-color"], //要改变的主题变量
//     indexFileName: "./public/index.html", // index.html所在位置
//     generateOnce: false // 是否只生成一次（如果你不想产生颜色。 在开发模式下，减少代码的每一个更改，使构建过程更快，赋予它真正的价值。 但是如果你的样式有了新的变化，你需要重新运行你的构建进程npm start。）
// };


module.exports = smp.wrap({
    mode: 'development',// 配置工作模式
    entry: ['./src/index.js', './public/index.html'],// 入口(简写)
    // entry: {
    //     main: './src/js/index.js'
    // },
    output: {// 出口
        path: path.resolve(__dirname, 'dist'),// 输出路径
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
                    loader: 'babel-loader?cacheDirectory',// cacheDirectory 选项，性能提速至少两倍，这会将转译的结果缓存到文件系统中。
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',// 按需引入需要使用polyfill
                                    corejs: { version: 3 },// 解决不能够找到core-js的问题
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
        new copyWebpackPlugin({
            patterns: [{//复制static到dist
                from: path.resolve(__dirname, '../src/static'),//打包的静态资源目录地址
                to: './static' //打包到dist下面的static
            }]
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',// 以当前文件作为模板创建新的html（1.结构和原来一样2.会自动引入打包的资源）
            favicon: './public/favicon_icon.ico' // ../public/favicon.ico
        }),
        new BundleAnalyzerPlugin({ analyzerPort: 8081 }),
        // new AntDesignThemePlugin(options)
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
        // publicPath: '/',
        inline: true,
    },
    // 代码映射，方便调试代码
    devtool: 'cheap-module-eval-source-map'
})