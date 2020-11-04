import { LAVALINK, POSTGRES, PRODUCTION } from './constants';
import { Guild } from './database/entities/Guild';

export enum Categories {
	VOICE,
	UTILS,
	MISC,
	ADMIN,
	ERROR,
}

export const Colors = {
	[Categories.VOICE]: '85e89d',
	[Categories.UTILS]: 'f97583',
	[Categories.MISC]: 'f692ce',
	[Categories.ADMIN]: 'ffea7f',
	[Categories.ERROR]: 'e74c3c',
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
