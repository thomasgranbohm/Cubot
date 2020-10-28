import { Length } from 'class-validator';
import { Snowflake } from 'discord.js';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Guild extends BaseEntity {
	@PrimaryColumn()
	guildId: Snowflake;

	@Column()
	@Length(1, 3)
	prefix: string = '!';
}
