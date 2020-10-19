import { Manager } from "@lavacord/discord.js";
import { Client, Collection, DiscordAPIError, Message, TextChannel, VoiceState } from "discord.js";
import { Command } from "./classes";
import * as commands from "./commands";
import { LavalinkConfig } from "./config";
import { BOT_MESSAGE_DELETE_TIMEOUT, DISCORD_TOKEN, GLOBAL_PREFIX, OWNER, USER_MESSAGE_DELETE_TIMEOUT } from "./constants";
import { setupDatabase } from "./database/index";
import { GuildResolver } from "./database/resolvers/GuildResolver";
import { ArgumentError, CustomError, GuildOnlyError, OwnerError } from "./errors";
import { BotOptions, ServerObject } from "./types";
import { checkPermissions, deleteMessage, getGuildFromMessage, sendError, sendMessage } from "./utils";

export class Bot extends Client {
	public owner: string;
	public prefix: string;

	public manager: Manager;

	public servers: Collection<String, ServerObject>;
	public commands: Collection<String, Command>;

	public guildResolver: GuildResolver;

	constructor(token: string, { owner, prefix, ...clientOptions }: BotOptions) {
		super({ ...clientOptions });

		this.owner = owner;
		this.prefix = prefix;

		this.commands = new Collection<String, Command>();
		this.servers = new Collection<String, ServerObject>();

		this.guildResolver = new GuildResolver();

		this.manager = new Manager(this, LavalinkConfig.nodes, {
			user: this.user?.id,
			shards: (this.shard && this.shard.count) || 1
		});

		this.on('ready', this.onReady);
		this.on('voiceStateUpdate', this.onVoiceStateUpdate);
		this.on('message', async (message) => {
			try {
				await this.onMessage(message);
			} catch (err) {
				/*
				Message Error Handling
				or
				MEH for-short
				*/
				if (err instanceof DiscordAPIError) {
					if (err.message === "Unknown Message" && err.code === 10008) {
						return;
					}
				}

				if (err instanceof CustomError || err instanceof DiscordAPIError) {
					if (err instanceof DiscordAPIError) console.error(err);
					sendError(this, err, message);
				}
			}
		});

		this.login(token);
	}

	loadCommands() {
		const entries = Object.entries(commands);
		for (let [name, TempCommand] of entries) {
			this.commands.set(name.toLowerCase(), new TempCommand(this));
		}
	}

	async connectToLavalink(retryIndex = 0) {
		try {
			await this.manager.connect();
			console.log("Successfully connected to Lavalink.")
		} catch (err) {
			if (retryIndex === 2) {
				console.error(`Could not connect to Lavalink on ${LavalinkConfig.host}:${LavalinkConfig.port}! Exiting...`);
				process.exit(1);
			}
			console.log(`#${++retryIndex}. Retrying Lavalink connection...`);
			setTimeout(() => this.connectToLavalink(retryIndex), 5000);
		}
	}

	async onReady() {
		await setupDatabase();
		await this.connectToLavalink();

		this.user?.setActivity({ name: `music! @ me`, type: "LISTENING" });

		this.loadCommands();

		console.log(`Started at ${new Date().toString().substr(0, 24)}!`)
	}

	async onMessage(message: Message) {
		const { content, channel, author, mentions } = message;

		const isBot = author.bot;
		if (isBot) return;

		let guild = await getGuildFromMessage(message);
		let prefix = await this.guildResolver.prefix(guild.id);

		const hasPrefix = content.startsWith(prefix) || content.startsWith(prefix.concat(" "));
		const mentionsBot = this.user ? mentions.has(this.user) : false;

		if (!hasPrefix && !mentionsBot) return;

		checkPermissions(message);

		const prefixLength = prefix.length + (+ content.startsWith(prefix.concat(" ")));
		const [name, ...args] = content.substr(prefixLength).split(" ");

		const command = this.commands.find((c) => c.names.includes(mentionsBot ? "help" : name));
		if (!command) return;

		if (command.needsArgs && args.length === 0)
			throw new ArgumentError(command, prefix);

		if (command.ownerOnly && author.id !== this.owner)
			throw new OwnerError();

		if (command.guildOnly && channel instanceof TextChannel !== false)
			throw new GuildOnlyError();

		let returningMessage = await command.run(message, args);
		if (!returningMessage || returningMessage === null) return;

		if (channel instanceof TextChannel !== false) {
			deleteMessage(
				message,
				USER_MESSAGE_DELETE_TIMEOUT
			);
		}

		deleteMessage(
			await sendMessage(channel, returningMessage, command.group),
			BOT_MESSAGE_DELETE_TIMEOUT
		);
	}

	async onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
		let guild = this.guilds.cache.get(oldState.guild.id);
		if (!guild)
			return;

		let voiceChannelId;
		if (oldState.channel) voiceChannelId = oldState.channel.id;
		else if (newState.channel) voiceChannelId = newState.channel.id;
		else return;

		let channel = guild.channels.cache.get(voiceChannelId);
		if (!channel)
			return;

		let userId = this.user?.id;
		if (!userId)
			return;
		let isInVoiceChannel = !!channel.members.get(userId);
		let onlyPersonInVC = (channel.members.size <= 1 && isInVoiceChannel);

		let justLeftVC = !isInVoiceChannel && channel.members.size >= 1 && oldState.member?.user == this.user;
		if (onlyPersonInVC || justLeftVC) {
			this.manager.leave(oldState.guild.id);

			if (this.servers.get(oldState.guild.id)) {
				this.servers.delete(oldState.guild.id);
			}
		}
	}
}

new Bot(DISCORD_TOKEN, { owner: OWNER, prefix: GLOBAL_PREFIX });
