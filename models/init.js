module.exports = async () => {
	const Sequelize = require('sequelize');
	const fs = require('fs').promises;

	let database = new Sequelize('CuBot', 'thomas', 'wowsa123', {
		host: 'localhost',
		dialect: 'sqlite',
		logging: false,
		storage: 'database.sqlite',
	});

	let modelFiles = (await fs.readdir('./models')).filter(file => !file.startsWith('init'))
	let models = [];
	for await (modelFile of modelFiles) {
		let model = require(`./${modelFile}`)(database, Sequelize);
		await model.sync();
		models[model.name] = model;
	}
	return { database, models }
}
