const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//使用UglifyJsPlugin及OptimizeCSSPlugin插件来 压缩JS及CSS文件
//当然如果你只是想简单的压缩，而不做任何配置的话
//可以按照官方文档中给出的方法使用optimization.minimizer: true

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//视频使用extract-text-webpack-plugin来提取CSS文件
//不过在webpack 4.x中则应该使用mini-css-extract-plugin来提取CSS到单独文件中
//https://blog.csdn.net/harsima/article/details/80819747

const isDev = process.env.NODE_ENV=='development'

const config = {
    target:'web',
    entry:path.join(__dirname,'src/index.js'),// 输入：项目主文件（入口文件）
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
        new HTMLPlugin({
            title:"mytodo",//网页标题
            filename: "index.html",
            favicon: ''
        }),
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
        new MiniCssExtractPlugin({
            //filename: "css/[name].[chunkhash:8].css"
            filename: "[name].[chunkhash:8].css"
        })

        
    );
    //https://juejin.im/post/5af1677c6fb9a07ab508dabb
    //将类库文件单独打包出来
    config.optimization = {
        splitChunks: {
            chunks: 'async',// 必须三选一： "initial" | "all" | "async"(默认就是异步)
            // 大于30KB才单独分离成chunk
            minSize: 30000,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,// 最大初始化请求书，默认1
            name: true,
            cacheGroups: {//设置缓存的 chunks
                default: {
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    name: 'vendors',    // 要缓存的 分隔出来的 chunk 名称
                    test: /[\\/]node_modules[\\/]/, //正则规则验证 符合就提取 chunk
                    priority: -10,      // 缓存组优先级
                    chunks: "all"       // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                },
                
                echarts: {
                    name: 'echarts',
                    chunks: 'all',
                    // 对echarts进行单独优化，优先级较高
                    priority: 20,
                    test: function(module){
                        var context = module.context;
                        return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)
                    }
                }
            }
        }
        //单独打包 runtimeChunk
        ,runtimeChunk:{name: "manifest"}
        // 压缩代码
        ,minimizer: [
            // js mini
            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              sourceMap: false // set to true if you want JS source maps
            }),
            // css mini
            new OptimizeCSSPlugin({})
        ]
    }
}
module.exports = config