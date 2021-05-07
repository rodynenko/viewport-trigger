const { rollup } = require('rollup');
const filesize = require('rollup-plugin-filesize');
const { getBabelOutputPlugin } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');

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
		build('dist/viewport-trigger.min.js', 'iife', [terser()]),
		build('dist/viewport-trigger.js', 'umd', [])
	]);
}

generateBundle();

module.exports = generateBundle;
