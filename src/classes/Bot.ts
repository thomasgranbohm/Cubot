import {
	Client,
	ClientOptions,
	Collection,
	ColorResolvable,
	Interaction,
	Message,
	MessageEmbed,
	Snowflake,
} from 'discord.js';
import Help from '../commands/Help';
import Join from '../commands/Join';
import Loop from '../commands/Loop';
import Now from '../commands/Now';
import Pause from '../commands/Pause';
import Ping from '../commands/Ping';
import Play from '../commands/Play';
import Queue from '../commands/Queue';
import Skip from '../commands/Skip';
import Volume from '../commands/Volume';
import { Categories } from '../constants';
import { NoArgumentsProvidedError } from '../errors';
import { debug, error, log } from '../logger';
import Messaging from '../namespaces/Messaging';
import Command from './Command';
import Subscription from './Subscription';

type BotOptions = {
	token: Snowflake;
} & ClientOptions;

export const subscriptions = new Collection<Snowflake, Subscription>();
export const commands = new Collection<string, Command>();
export const prefix = '1';
class Bot extends Client {
	constructor({ token, ...options }: BotOptions) {
		super(options);

		this.on('messageCreate', this.captureError(this.onMessageCreate));
		this.on(
			'interactionCreate',
			this.captureError(this.onInteractionCreate)
		);

		this.on('ready', () => log('Ready!'));

		for (const Class of [
			Skip,
			Join,
			Play,
			Ping,
			Now,
			Queue,
			Pause,
			Help,
			Loop,
			Volume,
		]) {
			const C = new Class();

			commands.set(C.names.slice()[0], C);
		}

		this.captureError(this.login)(token);
	}

	captureError<T>(f: (...args: T[]) => void) {
		return (...args: T[]) => {
			try {
				return f.bind(this)(...args);
			} catch (err) {
				error('Got error:', err);
			}
		};
	}

	async onMessageCreate(message: Message) {
		const { author, content, system } = message;
		
		if (system || author?.bot) return;
		if (content.startsWith(prefix) === false) return;

		const [target, ...rest] = content.slice(prefix.length).split(' ');

		const command = commands.find((c) =>
			c.names.includes(target.toLowerCase())
		);
		if (!command) {
			debug('Could not find command', `\x1b[47m\x1b[30m${target}\x1b[0m`);
			Messaging.remove(message);
			return;
		}

		try {
			// Check if command needs arguments
			if (command.needs_arguments && rest.length === 0)
				throw NoArgumentsProvidedError;

			const payload = await command.run(message, rest);

			Messaging.send(message, payload);
		} catch (err) {
			error(err);
			Messaging.send(message, {
				embeds: [
					new MessageEmbed()
						.setColor(Categories.ERROR as ColorResolvable)
						.setTitle(err.message),
				],
			});
		} finally {
			Messaging.remove(message);
		}
	}

	async onInteractionCreate(interaction: Interaction) {
		// if (!interaction.channel) return;
		// if (interaction instanceof MessageComponentInteraction) {
		// 	const command = commands.find((c) =>
		// 		c.names.includes(interaction.customId)
		// 	);
		// 	if (!command) return;
		// 	const payload = await command.run(interaction.message as Message);
		// 	if (interaction.message instanceof Message && payload)
		// 		interaction.reply(payload);
		// }
	}
}

export default Bot;
