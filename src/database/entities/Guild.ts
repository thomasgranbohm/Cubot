import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { Length } from "class-validator";
import { Snowflake } from "discord.js";

@Entity()
export class Guild extends BaseEntity {
	@PrimaryColumn()
	guildId: Snowflake;

	@Column()
	@Length(1, 3)
	prefix: string = "!";
}
