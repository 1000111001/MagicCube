const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
	entry: {
		main: './src/index.ts',
	},
	output: {
		filename: '[name]_[chunkhash].js',
		path: path.join(__dirname, 'dist'),
		clean: true,
	},
	mode: 'production',
	devServer: {
		open: true,
		static: './dist',
		hot: true,
		compress: true,
		client: {
			reconnect: true,
			progress: true,
			overlay: {
				errors: true,
				warnings: false,
				runtimeErrors: true,
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.(t|j)s$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			chunks: ['main'],
		}),
		new MiniCssExtractPlugin({
			filename: '[name]_[contenthash].css',
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), new TerserWebpackPlugin()],
	},
}
