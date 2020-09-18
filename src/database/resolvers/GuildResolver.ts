import { validate } from "class-validator";
import { Snowflake } from "discord.js";
import { FindOneOptions, getManager } from "typeorm";
import { Guild } from "../entities/Guild";

export class GuildResolver {

	async findOneOrCreate(guildId: Snowflake, options?: FindOneOptions<Guild>): Promise<Guild> {
		// TODO doesnt use options on create.
		let guild = await Guild
			.getRepository()
			.findOne({
				where: { guildId },
				...options
			});
		if (!guild) {
			console.warn("Creating new guild.")
			guild = await Guild
				.create({ guildId });

			const validationErrors = await validate(guild);
			if (validationErrors.length > 0) {
				throw new Error("Validation failed.");
			}

			await getManager().save(guild);
		}
		return guild;
	}

	async guild(
		guildId: Snowflake
	): Promise<Guild> {
		return this.findOneOrCreate(guildId);
	}

	async prefix(
		guildId: Snowflake
	): Promise<string> {
		const guild = await this.findOneOrCreate(guildId, { select: ["prefix"] });
		return guild.prefix;
	}

	async setPrefix(
		guildId: Snowflake,
		newPrefix: string
	): Promise<Guild> {
		// TODO needs to remove cache after updating...
		return Guild
			.getRepository()
			.save({
				guildId,
				prefix: newPrefix
			});
	}
}