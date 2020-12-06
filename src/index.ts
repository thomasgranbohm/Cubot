import { Manager } from '@lavacord/discord.js';
import {
	Client,
	Collection,
	DiscordAPIError,
	DMChannel,
	Message,
	TextChannel,
	VoiceState,
} from 'discord.js';
import { MainCommand } from './classes';
import * as commands from './commands';
import { LavalinkConfig } from './config';
import { DISCORD_TOKEN, GLOBAL_PREFIX, OWNER } from './constants';
import { setupDatabase } from './database/index';
import { GuildResolver } from './database/resolvers/GuildResolver';
import {
	ArgumentError,
	CustomError,
	GuildOnlyError,
	OwnerError,
} from './errors';
import * as logger from './logger';
import { BotOptions, ServerObject } from './types';
import { checkPermissions, getGuildFromMessage, sendError } from './utils';
import { addToCommandQueue } from './utils/commandQueue';

export class Bot extends Client {
	public owner: string;
	public prefix: string;

	public manager: Manager;

	public servers: Collection<String, ServerObject>;
	public commands: Collection<String, MainCommand>;

	public guildResolver: GuildResolver;

	constructor(
		token: string,
		{ owner, prefix, ...clientOptions }: BotOptions
	) {
		super({ ...clientOptions });

		this.owner = owner;
		this.prefix = prefix;

		this.commands = new Collection<String, MainCommand>();
		this.servers = new Collection<String, ServerObject>();

		this.guildResolver = new GuildResolver();

		this.manager = new Manager(this, LavalinkConfig.nodes, {
			user: this.user?.id,
			shards: (this.shard && this.shard.count) || 1,
		});

		this.on('ready', () => this.onError(this.onReady));
		this.on('message', (message: Message) =>
			this.onError(this.onMessage, message)
		);
		this.on(
			'voiceStateUpdate',
			(oldState: VoiceState, newState: VoiceState) =>
				this.onError(this.onVoiceStateUpdate, oldState, newState)
		);

		this.login(token);
	}

	private async onReady() {
		const loadCommands = () => {
			const entries = Object.entries(commands);
			for (const [name, TempCommand] of entries) {
				this.commands.set(name.toLowerCase(), new TempCommand(this));
			}
		};

		const connectToLavalink = async (retryIndex = 0) => {
			try {
				await this.manager.connect();
				logger.log('Successfully connected to Lavalink.');
			} catch (err) {
				if (retryIndex === 2) {
					logger.error(
						`Could not connect to Lavalink on ${LavalinkConfig.host}:${LavalinkConfig.port}! Exiting...`
					);
					process.exit(1);
				}
				logger.warn(
					`#${++retryIndex}. Retrying Lavalink connection...`
				);
				setTimeout(() => connectToLavalink(retryIndex), 5000);
			}
		};

		await setupDatabase();
		await connectToLavalink();
		loadCommands();

		this.user?.setActivity({
			name: `music! @ me`,
			type: 'LISTENING',
		});

		logger.log(`Started at ${new Date().toString().substr(0, 24)}!`);
	}

	private async onMessage(message: Message) {
		const { id: messageId, content, author, mentions, channel } = message;

		const isBot = author.bot;
		if (isBot) return;

		if (channel instanceof DMChannel) return;

		const guild = await getGuildFromMessage(message);
		const prefix = await this.guildResolver.prefix(guild.id);

		const hasPrefix =
			content.startsWith(prefix) ||
			content.startsWith(prefix.concat(' '));
		const mentionsBot = this.user
			? mentions.has(this.user, {
					ignoreEveryone: true,
					ignoreRoles: true,
			  })
			: false;

		if (!hasPrefix && !mentionsBot) return;

		checkPermissions(guild);

		const { id: guildId } = guild;

		const prefixLength =
			prefix.length + +content.startsWith(prefix.concat(' '));
		const [name, ...args] = content.substr(prefixLength).split(' ');

		const command = this.commands.find((c) =>
			c.names.includes(mentionsBot ? 'help' : name)
		);
		if (!command) return;

		if (command.needsArgs && args.length === 0)
			throw new ArgumentError(command, prefix);

		if (command.ownerOnly && author.id !== this.owner)
			throw new OwnerError();

		if (command.guildOnly && channel instanceof TextChannel === false)
			throw new GuildOnlyError();

		// TODO this do be kinda ugly tho
		addToCommandQueue(guildId, messageId, {
			channel,
			command,
			options: {
				message,
				args,
				category: command.group,
			},
		});
	}

	private async onVoiceStateUpdate(
		oldState: VoiceState,
		newState: VoiceState
	) {
		// TODO also do be kinda ugly
		const guild = this.guilds.cache.get(oldState.guild.id);
		if (!guild) return;

		let voiceChannelId;
		if (oldState.channel) voiceChannelId = oldState.channel.id;
		else if (newState.channel) voiceChannelId = newState.channel.id;
		else return;

		const channel = guild.channels.cache.get(voiceChannelId);
		if (!channel) return;

		const userId = this.user?.id;
		if (!userId) return;
		const isInVoiceChannel = !!channel.members.get(userId);
		const onlyPersonInVC = channel.members.size <= 1 && isInVoiceChannel;

		const justLeftVC =
			!isInVoiceChannel &&
			channel.members.size >= 1 &&
			oldState.member?.user == this.user;
		if (onlyPersonInVC || justLeftVC) {
			this.manager.leave(oldState.guild.id);

			if (this.servers.get(oldState.guild.id)) {
				this.servers.delete(oldState.guild.id);
			}
		}
	}

	private async onError(onReady: () => void): Promise<void>;
	private async onError(onMessage: Function, message: Message): Promise<void>;
	private async onError(
		onVoiceStateUpdate: Function,
		oldState: VoiceState,
		newState: VoiceState
	): Promise<void>;
	private async onError(
		f: Function,
		firstInput?: VoiceState | Message,
		secondInput?: VoiceState
	): Promise<void> {
		try {
			if (!firstInput && !secondInput) await f();
			else if (!!firstInput && !secondInput) await f(firstInput);
			else if (!!firstInput && !!secondInput)
				await f(firstInput, secondInput);
		} catch (error) {
			if (
				error instanceof CustomError === false &&
				error instanceof DiscordAPIError === false
			)
				return logger.error(error, 'Unknown error');

			if (
				error instanceof DiscordAPIError &&
				error.message === 'Unknown Message' &&
				error.code === 10008
			)
				return;

			if (!!firstInput && firstInput instanceof Message)
				sendError(error, firstInput);
			logger.error(error);
		}
	}
}

new Bot(DISCORD_TOKEN, { owner: OWNER, prefix: GLOBAL_PREFIX });
