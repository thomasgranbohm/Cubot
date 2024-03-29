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
import * as commandClasses from '../commands/';
import { Categories } from '../constants';
import { NoArgumentsProvidedError } from '../errors';
import * as interactionClasses from '../interactions/';
import { debug, error, log } from '../logger';
import Messaging from '../namespaces/Messaging';
import Command from './Command';
import Embed from './Embed';
import CustomInteraction from './Interaction';
import Subscription from './Subscription';

type BotOptions = {
	token: Snowflake;
} & ClientOptions;

export const commands = new Collection<string, Command>();
export const interactions = new Collection<string, CustomInteraction>();
export const subscriptions = new Collection<Snowflake, Subscription>();

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

		for (const Class of Object.values(commandClasses)) {
			const C = new Class();
			commands.set(C.name, C);
		}

		for (const Class of Object.values(interactionClasses)) {
			const C = new Class();
			interactions.set(C.name, C);
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
		if (!interaction.channel) return null;
		if (!interaction.isCommand() && !interaction.isButton()) return null;

		const query = interaction.isCommand()
			? interaction.commandName
			: interaction.isMessageComponent()
			? interaction.customId
			: '';

		const matching_interaction = interactions.get(query);
		if (!matching_interaction) return;

		try {
			await matching_interaction.run(interaction);
		} catch (err) {
			error(err);
			interaction.reply({
				embeds: [
					new Embed()
						.setColor(Categories.ERROR as ColorResolvable)
						.setTitle(err.message),
				],
				ephemeral: true,
			});
		}
	}
}

export default Bot;
