const HTMLWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const WebpackConfig = require('./webpack.common.js');
module.exports = merge(WebpackConfig, {
    entry: './src/main.js',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: [ 'vue-style-loader', 'css-loader', 'postcss-loader' ],
                        less: [ 'vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader' ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [ 'vue-style-loader', 'css-loader', 'postcss-loader' ]
            },
            {
                test: /\.less$/,
                use: [ 'vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader' ] 
            },
            {
                test: /\.s(c|a)ss$/,
                use: [ 'vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader' ] 
            },
        ]
    },
    devServer: {
        host: getIPAdress()
    }
})


function getIPAdress (){  
    var interfaces = require('os').networkInterfaces();  
    for(var devName in interfaces){  
          var iface = interfaces[devName];  
          for(var i=0;i<iface.length;i++){  
               var alias = iface[i];  
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
                     return alias.address;  
               }  
          }  
    }  
}