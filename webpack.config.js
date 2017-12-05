var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/vivid.js',
	devtool: 'source-map',
	output: {
		filename: 'vivid.js',
		path: path.resolve(__dirname, 'lib'),
		library: 'Vivid',
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
			sourceMap: true,
			compress: {
				warnings: false,
			}
		}),
	]
};
