const MiniCssExtract = require('mini-css-extract-plugin');
const Clean = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const WebpackConfig = require('./webpack.common.js');
module.exports = merge(WebpackConfig, {
    entry: './src/main.js',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: [ MiniCssExtract.loader, 'css-loader?minimize=true', 'postcss-loader?sourceMap=inline' ],
                        less: [ MiniCssExtract.loader, 'css-loader?minimize=true', 'postcss-loader?sourceMap=inline', 'less-loader' ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [ MiniCssExtract.loader, 'css-loader?minimize=true', 'postcss-loader?sourceMap=inline' ]
            },
            {
                test: /\.less$/,
                use: [ MiniCssExtract.loader, 'css-loader?minimize=true', 'postcss-loader?sourceMap=inline', 'less-loader' ]
            },
            {
                test: /\.s(a|c)ss$/,
                user: [MiniCssExtract.loader, 'css-loader?minimize=true', 'postcss-loader?sourceMap=inline', 'sass-loader']
            }
        ]
    },
    plugins: [
        new Clean(['dist']),  // 打包前清理文件夹
        new MiniCssExtract({filename: 'css/[name].[hash:8].css'}),  // 分离样式
    ]
})