const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV=='development'

const config = {
    target:'web',
    entry:path.join(__dirname,'src/index.js'),
    output:{
        filename:'bundle.js',
        path:path.join(__dirname,'dist')
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:isDev?'"development"':'"production"'
            }
        }),
        new HTMLPlugin(),
    ],
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test:/\.jsx$/,
                loader:'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
            /*{
                test: /\.styl$/,
                use: ['style-loader','css-loader',{loader:'postcss-loader',options:{sourceMap:true}},'stylus-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
            },*/
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,
                            name:'[name]-ssq.[ext]'
                        }
                    }
                ]
            }
        ]
    }

}

//判断不同环境
if(isDev){
    // 开发坏境的配置
    config.module.rules.push({
        test: /\.styl/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    });
    config.devtool = "#cheap-module-eval-source-map"
    config.devServer = {
        port:8000,
        host:'0.0.0.0',
        overlay:{
            error:true,
        },
        hot:true//热更新 =。=
        //open:true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}
module.exports = config