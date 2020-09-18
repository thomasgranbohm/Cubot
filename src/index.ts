import { Manager } from "@lavacord/discord.js";
import { Client, Collection, DMChannel, Message, VoiceState } from "discord.js";
import { Command } from "./classes";
import * as commands from "./commands";
import { LavalinkConfig } from "./config";
import { DISCORD_TOKEN, OWNER, PREFIX } from "./constants";
import { setupDatabase } from "./database/index";
import { GuildResolver } from "./database/resolvers/GuildResolver";
import { ArgumentError, MissingPermissionsError, OwnerError, PermissionError } from "./errors";
import { BotOptions, ServerObject } from "./types";
import { getGuildFromMessage, sendMessage } from "./utils";
import sendError from "./utils/sendError";



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

		this.on('ready', this.onReady)
		this.on('message', this.onMessage)
		this.on('voiceStateUpdate', this.onVoiceStateUpdate)

		this.login(token);
	}

	loadCommands(): void {
		const entries = Object.entries(commands);
		for (let [name, command] of entries) {
			this.commands.set(name.toLowerCase(), new command(this));
		}
	}

	async connectToLavalink(retryIndex = 0) {
		try {
			await this.manager.connect();
		} catch (err) {
			if (retryIndex === 2) {
				console.error(`Could not connect to Lavalink on ${LavalinkConfig.host}:${LavalinkConfig.port}! Exiting...`)
				process.exit(1);
			}
			console.log("Retrying Lavalink connection...")
			setTimeout(() => this.connectToLavalink(++retryIndex), 5000);
		}
	}

	async onReady() {
		await setupDatabase();
		await this.connectToLavalink()

		this.user?.setActivity({ name: `music! @ me`, type: "LISTENING", url: "https://github.com/thomasgranbohm/CuBot" })

		this.loadCommands();

		console.log(`Ready at ${new Date().toString().substr(16, 8)}`)
	}

	async onMessage(message: Message): Promise<void> {
		const { content, channel, author, mentions } = message;

		const isBot = author.bot;
		if (isBot) return;

		let guild = await getGuildFromMessage(message);
		let { id: guildId } = guild;
		let prefix = await this.guildResolver.prefix(guildId);

		// TODO permission check
		// let guildMember = await message.guild?.members.fetch(this.user as User);
		// let rolesOfMember = guildMember?.roles.cache.find((role, key) => role.permissions.DEFAULT === PERMISSIONS_INTEGER);
		// if (guildMember) {
		// 	let permissions = (channel as GuildChannel).permissionsFor(guildMember)
		// 	console.log(permissions)
		// }

		const hasPrefix = content.startsWith(prefix);
		const mentionsBot = this.user ? mentions.has(this.user) : false;
		if (!hasPrefix && !mentionsBot) return;

		if (channel instanceof DMChannel !== true) {
			message
				.delete({ timeout: 3000 })
				.catch((err) => {
					console.error(err)
					if (guild) {
						sendError(this, new MissingPermissionsError(), message)
					}
				});
		}

		if (mentionsBot) {
			const help = this.commands.get("help");
			if (!help) return;
			const returningMessage = await help.run(message);
			if (!returningMessage) return;
			return sendMessage(channel, returningMessage, help.group, author);
		}

		const [name, ...args] = content.substr(prefix.length).split(" ");

		const command = this.commands.find((c) => c.names.includes(name));
		if (!command) return;

		try {
			if (command.needsArgs && args.length === 0)
				throw new ArgumentError(command);
			if (command.ownerOnly && author.id !== this.owner)
				throw new OwnerError();
			if (command.guildOnly && channel.type !== "text")
				throw new PermissionError()

			let returningMessage = await command.run(message, args)
			if (!returningMessage || returningMessage === null) return;

			await sendMessage(channel, returningMessage, command.group, author)
		} catch (err) {
			await sendError(this, err, message);
		}
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

new Bot(DISCORD_TOKEN, { owner: OWNER, prefix: PREFIX });
