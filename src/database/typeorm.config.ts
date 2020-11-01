import { POSTGRES, PRODUCTION } from '../constants';
import { Guild } from './entities/Guild';

export const TOConfig = {
	host: 'database',
	type: 'postgres',
	database: 'cubot',
	username: POSTGRES.USERNAME,
	password: POSTGRES.PASSWORD,
	logging: !PRODUCTION,
	synchronize: true,
	entities: [Guild],
	cache: {
		type: 'redis',
		duration: 30000,
		alwaysEnabled: true,
		options: {
			host: 'cache',
		},
	},
};

export const TOConfigNoDB = {
	host: 'database',
	type: 'postgres',
	username: POSTGRES.USERNAME,
	password: POSTGRES.PASSWORD,
	logging: !PRODUCTION,
	synchronize: true,
};
