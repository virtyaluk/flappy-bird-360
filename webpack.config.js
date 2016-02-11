/**
 * Flappy Bird 360 - a small clone of Flappy Bird for web using PhaserJS.
 * https://github.com/virtyaluk/flappy-bird-360
 *
 * Copyright (c) 2016 Bohdan Shtepan
 * http://modern-dev.com/
 *
 * Licensed under the MIT license.
 */

var BannerPlugin = require('webpack').BannerPlugin;

var banner = 'Flappy Bird 360 - a small clone of Flappy Bird for web using PhaserJS.' + '\r\n' +
+ 'https://github.com/virtyaluk/flappy-bird-360' + '\r\n' +
+ 'Copyright (c) 2016 Bohdan Shtepan' + '\r\n' +
+ 'http://modern-dev.com/' + '\r\n' +
+ 'Licensed under the MIT license.';

module.exports = {
	entry: './src/game.js',
	output: {
		path: __dirname + '/dist',
		libraryTarget: 'umd',
		library: 'FlappyBird360',
		filename: 'flappy-bird-360.js',
		publicPath: 'http://localhost:8080/dist'
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
                test: /(\.jsx|\.js)$/,
                loader: 'eslint-loader',
                exclude: /(node_modules|bower_components|dist)/
            }
		]
	},
	plugins: [
		new BannerPlugin(banner)
	],
	resolve: {
        extensions: ['', '.js', '.jsx', '.scss']
    }
};