module.exports = {
	entry: __dirname + '/demo',
	output: {
		path: __dirname,
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel',
			query: {
				presets: ['react', 'es2015'],
				plugins: [
    				'add-module-exports',
					'transform-class-properties'
				]
			}
		}]
	}
};