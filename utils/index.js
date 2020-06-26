const fs = require('fs');

fs.readdirSync('./utils')
	.filter(
		(file) =>
			file.endsWith('.js') &&
			!file.startsWith('index') &&
			!file.startsWith('.'),
	)
	.map((file) => file.replace('.js', ''))
	.forEach((file) => {
		let util = require(`./${file}`);
		exports[util.name] = util;
	});