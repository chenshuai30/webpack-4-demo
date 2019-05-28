const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash:8].js',
        publicPath: ''
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@assets': path.resolve(__dirname, './src/static')
        },
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules/vue-echarts'), path.resolve(__dirname, 'node_modules/resize-detector')]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader?limit=1024&name=audio/[name].[hash:8].[ext]&publicPath=/'
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024&name=images/[name].[hash:8].[ext]&publicPath=/'
            }
        ]
    },
    optimization: {
        // runtimeChunk: {
        //     name: 'manifest'  // 公共模块名字
        // },
        splitChunks: {
            cacheGroups: {
                // 提取公共文件  
                // commons: {
                //     chunks: 'initial',
                //     minChunks: 1,
                //     maxInitialRequests: 5,
                //     minSize: 0,
                // },
                // 提取公共模块
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    priority: 10,
                    enforce: true,
                },
                // 提取公共样式
                styles: {
                    name: 'styles',
                    test: /\.less$/,
                    chunks: 'all',
                    enforce: true,
                }
            }
        }
        // splitChunks: {
        //     chunks: "async",
        //     minSize: 30000,
        //     minChunks: 1,
        //     maxAsyncRequests: 5,
        //     maxInitialRequests: 3,
        //     automaticNameDelimiter: '~',
        //     name: true,
        //     cacheGroups: {
        //         vendors: {
        //             test: /[\\/]node_modules[\\/]/,
        //             priority: -10
        //         },
        //         default: {
        //             minChunks: 2,
        //             priority: -20,
        //             reuseExistingChunk: true
        //         }
        //     }
        // }
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash'
        }),
        new HTMLWebpackPlugin({
            template: './index.html',
            inject: true,
            filename: 'index.html',
            // chunks: ['vendor', 'main', 'common'],
            // chunksSortMode: 'dependency'
        }),
        new VueLoaderPlugin()
    ]
}