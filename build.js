const { rollup } = require('rollup');
const filesize = require('rollup-plugin-filesize');
const { getBabelOutputPlugin } = require('@rollup/plugin-babel');
const { uglify } = require('rollup-plugin-uglify');

const defaultPlugins = [
	getBabelOutputPlugin({ presets: ['@babel/preset-env'], allowAllFormats: true }),
	filesize()
];

function build(target, format, plugins) {
	return rollup({
		input: 'src/viewport-trigger.js',
		plugins: defaultPlugins.concat(plugins)
	})
		.then((bundle) => bundle.write({
			file: target,
			format,
			name: 'ViewportTrigger'
		}))
		.catch((err) => {
			console.log(err);
		});
}

function generateBundle() {
	return Promise.all([
		build('dist/viewport-trigger.min.js', 'iife', [uglify()]),
		build('dist/viewport-trigger.js', 'umd', [])
	]);
}

generateBundle();

module.exports = generateBundle;
