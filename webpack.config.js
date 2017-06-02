var webpack = require('webpack'),
	path = require('path'),
	precss = require('precss'),
	autoprefixer = require('autoprefixer'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	CompressionPlugin = require('compression-webpack-plugin');

var config = {
	target:'web',
	devServer:{
		contentBase: path.join(__dirname,'public'),
		historyApiFallback: true,
		overlay: true,
		hot: true,
		compress: true,
		port: process.env.PORT || 80,
		host: '0.0.0.0'
	},

	output: {
		path: path.join(__dirname,'public'),
		publicPath:'/'
	},
	resolve:{
		modules:['node_modules',path.join(__dirname,'app')]
	},
	module:{
		rules: [
			{
				test:/\.(jpg|png|ico)$/,
				loader: 'url-loader',
				options:{
					limit: 1024,
					name:'[name].[ext]'
				}
			},
			{
				test:/\.(otf|woff|woff2)$/,
				loader: 'url-loader',
				options:{
					limit: 1024,
					name:'./fonts/[name].[ext]'
				}
			},
			{
			test:/\.svg$/,
			loader:'svg-inline-loader',
			options:{
				removeTags:true,
				removingTags:['title', 'desc', 'defs', 'style'],
				warnTags:['desc', 'defs', 'style'],
				removeSVGTagAttrs:true,
				classPrefix:true,
				idPrefix: true
			}
		}]
	},
	plugins:[
		new webpack.LoaderOptionsPlugin({
			test:/\.less$/,
			options:{
				postcss:function(){
					return {
						defaults: [precss, autoprefixer],
						cleaner:  [autoprefixer()]
					}
				},
			}
		}),
		new HtmlWebpackPlugin({
			template:'./src/index.html'
		})
	]
}


if(process.env.NODE_ENV !== 'production'){

   config['entry'] = [
	   'react-hot-loader/patch',
		'webpack-dev-server/client?http://localhost:8080/',
		'webpack/hot/only-dev-server/',
		'./src/index.js']
	config.output['filename'] = 'bundle.js'
	config.module.rules.push({
		test:/\.less$/,
		use: [
			'style-loader',
			{
				loader:'css-loader',
				options:{
					minimize: true
				}
			},
			{
				loader:'postcss-loader',
				options:{
					sourceMap:'inline',
					pack:'cleaner'
				}
			},
			{
				loader: 'less-loader',
				options: {
					lint: true,
					noIeCompat:true,
					sourceMap: true,
					strictImports:true,
					strictMath: true,
					strictUnits:true
				}
			}
		]
	})
	config.module.rules.push(
		{
			test: /\.js$/,
			exclude: '/node_modules/',
			use:[
				'react-hot-loader/webpack',
				{
					loader:'babel-loader',
					options:{
						presets:['es2015','react']
					}
				}
			]
	})
	config.plugins.push(...[
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env':{
				NODE_ENV:JSON.stringify('development'),
			}
		}),
		new webpack.NamedModulesPlugin()
	])

}else{
	config['entry'] = {
		'app':['./src/index.js']
	}

	config.output['filename'] = '[name].[hash].js'
	config.module.rules.push(
		{
			test: /\.js$/,
			exclude: '/node_modules/',
			use:[
				{
					loader:'babel-loader',
					options:{
						presets:['es2015','react'],
						plugins:['transform-object-rest-spread']
					}
				}
			]
	})
	config.module.rules.push({
		test:/\.less$/,
		use: ExtractTextPlugin.extract({
			fallback:'style-loader',
			use:[
				{
					loader:'css-loader',
					options:{
						minimize: true
					}
				},
				{
					loader:'postcss-loader',
					options:{
						sourceMap:'inline',
						pack:'cleaner'
					}
				},
				{
					loader: 'less-loader',
					options: {
						lint: true,
						noIeCompat:true,
						sourceMap: true,
						strictImports:true,
						strictMath: true,
						strictUnits:true
					}
				}
			]
		})
	})

	config.plugins.push(...[
		new webpack.LoaderOptionsPlugin({
			test:/\.less$/,
			options:{
				postcss:function(){
					return {
						defaults: [precss, autoprefixer],
						cleaner:  [autoprefixer()]
					}
				},
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: ({ resource }) => {
				return /node_modules/.test(resource)
			}
		}),
		new webpack.DefinePlugin({
			'process.env':{
				NODE_ENV:JSON.stringify('production'),
			}
		}),
		new CompressionPlugin({
			asset:'[file].gz',
			algorithm: "gzip",
			test: /\.js$|\.html$|\.css$/,
			threshold: 1024,
			minRatio: 0.9
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console:true
			},
			comments:false
		}),
		new ExtractTextPlugin("[name].[hash].css")
	])
}



module.exports = config
