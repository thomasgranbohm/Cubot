module.exports = async () => {
	const Sequelize = require('sequelize');
	const fs = require('fs').promises;

	var database = new Sequelize('CuBot', 'thomas', 'wowsa123', {
		host: 'localhost',
		dialect: 'sqlite',
		logging: false,
		storage: 'database.sqlite',
	});
	var models = (await fs.readdir('./models'))
		.filter(file => !file.startsWith('init'))
		.map(file => {
			return require(`./${file}`)(database, Sequelize);
		})
	return { database, models }
}
