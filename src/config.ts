import { LAVALINK, POSTGRES, PRODUCTION } from './constants';
import { Guild } from './database/entities/Guild';

export const Categories = {
	'VOICE': '85e89d',
	'UTILS': 'f97583',
	'MISC': 'f692ce',
	'ADMIN': 'ffea7f',
	'ERROR': 'e74c3c',
};

export const LavalinkConfig = {
	host: LAVALINK.URI,
	port: LAVALINK.PORT,
	password: LAVALINK.PASSWORD,
	nodes: [
		{
			id: '1',
			host: LAVALINK.URI,
			port: LAVALINK.PORT,
			password: LAVALINK.PASSWORD,
		},
	],
};

export const BaseTypeORMConfig = {
	host: 'database',
	type: 'postgres',
	username: POSTGRES.USERNAME,
	password: POSTGRES.PASSWORD,
	logging: !PRODUCTION,
	synchronize: true,
};

export const TypeORMConfig = {
	...BaseTypeORMConfig,
	database: 'cubot',
	entities: [Guild],
};
