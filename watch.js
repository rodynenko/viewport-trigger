const chokidar = require('chokidar');
const regenerateBundle = require('./build');

chokidar.watch('src/**/*.js').on('change', (path) => {
	console.log('file is changed', path);
	regenerateBundle();
});
