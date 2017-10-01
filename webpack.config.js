var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/jtml.js',
	devtool: 'source-map',
	output: {
		filename: 'jtml.js',
		path: path.resolve(__dirname, 'lib'),
		library: 'jtml',
		libraryTarget: 'umd',
		libraryExport: "default"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: /src/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			}
		}),
	]
};
