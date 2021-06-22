import { Message, MessageEmbed, PermissionString } from 'discord.js';
import { CustomEmbed, MainCommand } from '../classes';
import { Categories } from '../config';
import { PERMISSIONS_INTEGER, PERMISSION_DETAILS } from '../constants';
import { Bot } from '../index';
import { Permissions as DiscordPermissions } from 'discord.js';

export class Permissions extends MainCommand {
	constructor(client: Bot) {
		super(client, {
			description: 'Get a list of which permissions are missing.',
			aliases: ['settings', 'perms'],
			category: Categories.MISC,
			guildOnly: true,
		});
	}

	async run(
		message: Message,
		args?: string[]
	): Promise<string | MessageEmbed> {
		const { guild } = message;

		if (!guild || !guild.me || guild.me.hasPermission(PERMISSIONS_INTEGER))
			return 'You have already granted every permission I need! :tada:';

		let { permissions } = guild.me;
		let missingPermissions = new DiscordPermissions(PERMISSIONS_INTEGER)
			.toArray()
			.filter((perm: PermissionString) =>
				!permissions.toArray().includes(perm) ? perm : undefined
			)
			.sort()
			.map((perm: PermissionString) => {
				const { name, description, type } = PERMISSION_DETAILS[perm];
				return `**${name}** – ${description}${
					type === 'critical' ? ' **CRITICAL**' : ''
				}${type === 'not in use' ? ' *not in use*' : ''}`;
			});

		return new CustomEmbed()
			.setTitle('Permissions:')
			.setDescription(missingPermissions);
	}
}
