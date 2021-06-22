import { config } from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';
import YAML from 'yaml';
config({ path: resolve(process.cwd(), '.env') });

const {
	USING_COMPOSE,
	DATABASE_USERNAME,
	DATABASE_PASSWORD,
	NODE_ENV,
	DISCORD_TOKEN: TOKEN,
} = process.env;

export const GLOBAL_PREFIX = '!';
export const OWNER = '284754083049504770';
export const DISCORD_TOKEN = TOKEN || 'INSERT YOUR TOKEN IN THE .env FILE';
export const PRODUCTION = NODE_ENV === 'production';

export const DATABASE = {
	HOST: USING_COMPOSE ? 'database' : 'localhost',
	USERNAME: DATABASE_USERNAME || 'postgres',
	PASSWORD: DATABASE_PASSWORD || 'postgres',
	DATABASE: 'cubot',
};

export const LAVALINK = (
	USING_COMPOSE
		? {
				URI: 'lavalink',
				PORT: 2333,
				PASSWORD: 'youshallnotpass',
		  }
		: (() => {
				const file = fs.readFileSync(
					resolve(process.cwd(), 'application.yml'),
					'utf8'
				);
				const parsed = YAML.parse(file);
				const { port, address } = parsed.server;
				const { password } = parsed.lavalink.server;

				return {
					URI: address,
					PORT: port,
					PASSWORD: password,
				};
		  })()
) as { URI: string; PORT: number; PASSWORD: string };

export const PERMISSIONS_INTEGER = 305659632;
export const UPPER_VOLUME_LIMIT = 300;
export const PLAYLIST_AMOUNT = 15;

export const BOT_MESSAGE_DELETE_TIMEOUT = 20;
export const USER_MESSAGE_DELETE_TIMEOUT = 5;

export const MESSAGE_EMBED_MAX_LINES = 8;
