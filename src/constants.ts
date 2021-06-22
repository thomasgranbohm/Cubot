import { config } from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';
import YAML from 'yaml';
import { PermissionArrayType } from './types';
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

export const PERMISSIONS_INTEGER = 2251947968;
export const PERMISSION_DETAILS: PermissionArrayType = {
	ADD_REACTIONS: {
		name: 'Add reactions',
		description: 'Give the bot the ability to add reactions to messages.',
	},
	VIEW_AUDIT_LOG: {
		name: 'View audit log',
		description: 'View the logs of actions by admins and such.',
		type: 'not in use',
	},
	PRIORITY_SPEAKER: {
		name: 'Priority speaker',
		description: 'Make the bot a priority speaker.',
		type: 'not in use',
	},
	STREAM: {
		name: 'Stream',
		description: 'Stream video when that feature is available to bots.',
		type: 'not in use',
	},
	VIEW_CHANNEL: {
		name: 'View channel',
		description: 'View the channel that we are in.',
		type: 'critical',
	},
	SEND_MESSAGES: {
		name: 'Send messages',
		description: 'Send messages in this guild.',
		type: 'critical',
	},
	SEND_TTS_MESSAGES: {
		name: 'Send TTS messages',
		description: 'Send text-to-speech messages.',
	},
	MANAGE_MESSAGES: {
		name: 'Manage messages',
		description: 'Remove messages and reactions, used for clean up.',
	},
	EMBED_LINKS: {
		name: 'Embed links',
		description: 'Send messages with links.',
		type: 'critical',
	},
	ATTACH_FILES: {
		name: 'Attach files',
		description: 'Send thumbnails for videos.',
		type: 'critical',
	},
	READ_MESSAGE_HISTORY: {
		name: 'Read message history',
		description: 'View the message history.',
		type: 'not in use',
	},
	VIEW_GUILD_INSIGHTS: {
		name: 'View guild insights',
		description: 'View stats about this guild.',
		type: 'not in use',
	},
	CONNECT: {
		name: 'Connect',
		description: 'Connect to a voice channel.',
		type: 'critical',
	},
	SPEAK: {
		name: 'Speak',
		description: 'Output audio to a voice channel',
		type: 'critical',
	},
	USE_VAD: {
		name: 'Use VAD',
		description: 'Use voice activation detection.',
		type: 'not in use',
	},
	CHANGE_NICKNAME: {
		name: 'Change nickname',
		description: 'Change my own nickname.',
		type: 'not in use',
	},
};

export const UPPER_VOLUME_LIMIT = 300;
export const PLAYLIST_AMOUNT = 15;

export const BOT_MESSAGE_DELETE_TIMEOUT = 20;
export const USER_MESSAGE_DELETE_TIMEOUT = 5;

export const MESSAGE_EMBED_MAX_LINES = 8;
