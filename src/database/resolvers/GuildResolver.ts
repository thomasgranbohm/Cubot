import { Snowflake } from 'discord.js';
import { Guild } from '../entities/Guild';

export class GuildResolver {
	async findOneOrCreate(guildId: Snowflake): Promise<Guild> {
		// TODO doesnt use options on create.
		try {
			const guild = await Guild.findOneOrFail(guildId);
			return guild;
		} catch (error) {
			/*
			 * This is really bad.
			 * I should not have to remove cached result from a function
			 * which should fail is none is found...
			 */
			return Guild.create({ guildId }).save();
		}
	}

	async guild(guildId: Snowflake): Promise<Guild> {
		return this.findOneOrCreate(guildId);
	}

	async prefix(guildId: Snowflake): Promise<string> {
		const guild = await this.findOneOrCreate(guildId);
		return guild.prefix;
	}

	async setPrefix(
		guildId: Snowflake,
		newPrefix: string
	): Promise<Guild> {
		if (newPrefix.length < 1 || newPrefix.length > 3) {
			throw new Error(
				'New prefix out of range (1 – 3 characters)'
			);
		}
		return Guild.getRepository().save({
			guildId,
			prefix: newPrefix,
		});
	}
}
