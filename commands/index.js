const fs = require('fs');

fs.readdirSync('./commands')
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