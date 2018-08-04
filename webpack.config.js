const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//视频使用extract-text-webpack-plugin来提取CSS文件
//不过在webpack 4.x中则应该使用mini-css-extract-plugin来提取CSS到单独文件中
//https://blog.csdn.net/harsima/article/details/80819747

const isDev = process.env.NODE_ENV=='development'

const config = {
    target:'web',
    entry:path.join(__dirname,'src/index.js'),
    output:{
        // 输出
        filename:'bundle.[hash:8].js',// 输出的文件名
        path:path.join(__dirname,'dist')// 输出路径
    },
    // webpack插件配置
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:isDev?'"development"':'"production"'
            }
        }),
        new HTMLPlugin(),
    ],
    module:{ // 配置加载资源
        rules:[ // 规则
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
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,// 文件小于1024字节，转换成base64编码，写入文件里面
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
            // webpack编译出现错误，则显示到网页上
            error:true,
        },
        hot:true//不刷新热加载数据
        //open:true//直接打开浏览器
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}else{
    // 生产坏境的配置
    config.output.filename = '[name].[chunkhash:8].js';

    let extractLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {}
    }

    config.module.rules.push({
        test: /\.styl/,
         use: [
            extractLoader,
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
    config.plugins.push(
        new MiniCssExtractPlugin('styles.[contenthash:7].css')

        // // 将类库文件单独打包出来
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor'
        // })

        // webpack相关的代码单独打包
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'runtime'
        // })
    );
}
module.exports = config