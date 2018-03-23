const { rollup } = require('rollup');
const filesize = require('rollup-plugin-filesize');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

const targets = {
	min: 'dist/viewport-trigger.min.js',
	umd: 'dist/viewport-trigger.js'
};

const defaultPlugins = [
	babel({
		babelrc: false,
		presets: [
			[
				'env',
				{
					modules: false
				}
			],
			'stage-0'
		],
		plugins: [
			'external-helpers'
		]
	}),
	filesize()
];

function build(type) {
	const plugins = type === 'min' ? defaultPlugins.concat(uglify()) : defaultPlugins;

	return rollup({
		input: 'src/viewport-trigger.js',
		plugins
	}).then(bundle =>
		bundle.write({
			file: targets[type],
			format: type === 'min' ? 'iife' : 'umd',
			name: 'ViewportTrigger'
		}));
}

function generateBundle() {
	return Promise.all([build('umd'), build('min')])
		.catch(err => console.log(err));
}

generateBundle();

module.exports = generateBundle;
