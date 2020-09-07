import { Client, Collection, Message } from "discord.js";
import { Manager } from "@lavacord/discord.js";

import { DISCORD_TOKEN, OWNER, PREFIX } from "./constants";
import { BotOptions, ServerObject } from "./types";
import { ArgumentError, OwnerError, PermissionError, MissingPermissionsError } from "./errors";

import { Command } from "./classes";
import * as commands from "./commands";
import { sendMessage } from "./utils";
import { LavalinkConfig } from "./config";
import sendError from "./utils/sendError";

export class Bot extends Client {
	public owner: string;
	public prefix: string;

	public manager: Manager;

	public servers: Collection<String, ServerObject>;
	public commands: Collection<String, Command>;

	constructor(token: string, { owner, prefix, ...clientOptions }: BotOptions) {
		super({ ...clientOptions });

		this.owner = owner;
		this.prefix = prefix;

		this.commands = new Collection<String, Command>();
		this.servers = new Collection<String, ServerObject>();

		this.manager = new Manager(this, LavalinkConfig.nodes, {
			user: this.user?.id,
			shards: (this.shard && this.shard.count) || 1
		});

		this.on('ready', this.onReady)
		this.on('message', this.onMessage)

		this.login(token).then(() => console.log(`Ready at ${new Date().toString().substr(16, 8)}`));
	}

	loadCommands(): void {
		const entries = Object.entries(commands);
		for (let [name, command] of entries) {
			this.commands.set(name.toLowerCase(), new command(this));
		}
	}

	async onReady() {
		await this.manager.connect();
		this.user?.setActivity({ name: `at ${new Date().toString().substr(16, 8)}` })

		this.loadCommands();
	}

	async onMessage(message: Message): Promise<void> {
		const { content, channel, author, guild } = message;

		const isBot = author.bot;
		if (isBot) return;

		// TODO permission check
		// let guildMember = await message.guild?.members.fetch(this.user as User);
		// let rolesOfMember = guildMember?.roles.cache.find((role, key) => role.permissions.DEFAULT === PERMISSIONS_INTEGER);
		// if (guildMember) {
		// 	let permissions = (channel as GuildChannel).permissionsFor(guildMember)
		// 	console.log(permissions)
		// }

		const hasPrefix = content.startsWith(this.prefix);
		if (!hasPrefix) return console.warn("Has no prefix");

		const [name, ...args] = content.substr(1).split(" ");

		const command = this.commands.get(name);
		if (!command) return;

		let returningMessage = undefined;

		console.warn("Found command", command.names.slice().shift())

		try {
			if (command.needsArgs && args.length === 0)
				throw new ArgumentError(command);
			if (command.ownerOnly && author.id !== this.owner)
				throw new OwnerError();
			if (command.guildOnly && channel.type !== "text")
				throw new PermissionError()

			returningMessage = await command.run(message, args)
		} catch (err) {
			returningMessage = err;
		}

		if (!returningMessage) return;

		message
			.delete({ timeout: 3000 })
			.catch(err => {
				console.error(err)
				if (guild) {
					sendError(this, new MissingPermissionsError(), message)
				}
			});

		if (message instanceof Error) {
			sendError(this, returningMessage, message);
		} else {
			sendMessage(channel, returningMessage, command.group, author);
		}
	}
}

new Bot(DISCORD_TOKEN, { owner: OWNER, prefix: PREFIX });
