import Bot from './classes/Bot';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

new Bot({
	token: process.env.DISCORD_TOKEN,
	intents: [
		'GUILDS',
		'GUILD_INTEGRATIONS',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'GUILD_VOICE_STATES',
	],
});
