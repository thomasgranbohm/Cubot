import { validate } from "class-validator";
import { Snowflake } from "discord.js";
import { FindOneOptions, getConnection, getManager } from "typeorm";
import { Guild } from "../entities/Guild";

export class GuildResolver {

	async findOneOrCreate(guildId: Snowflake, options?: FindOneOptions<Guild>): Promise<Guild> {
		// TODO doesnt use options on create.
		let guild = await Guild
			.getRepository()
			.findOne({
				where: { guildId },
				cache: {
					id: "guildIds",
					milliseconds: 5000
				},
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
		// I think this removes all the cached data.
		await getConnection().queryResultCache?.remove(["guildIds"]);
		if (newPrefix.length < 1 || newPrefix.length > 3)
			throw new Error("New prefix out of range (1 – 3 characters)")
		return Guild
			.getRepository()
			.save({
				guildId,
				prefix: newPrefix
			});
	}
}