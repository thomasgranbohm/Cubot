import { ColorResolvable, MessageEmbed } from 'discord.js';
import Command from './Command';

export type EmbedOptions = Command;

class Embed extends MessageEmbed {
	constructor(command: EmbedOptions) {
		super();

		this.setColor(command.category as ColorResolvable);
	}
}

export default Embed;
