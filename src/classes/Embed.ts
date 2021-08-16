import { ColorResolvable, MessageEmbed } from 'discord.js';
import { Categories } from '../constants';
import Command from './Command';
import CustomInteraction from './Interaction';

export type EmbedOptions = Command | CustomInteraction;

class Embed extends MessageEmbed {
	constructor(command?: EmbedOptions) {
		super();

		if (command) this.setColor(command.category as ColorResolvable);
		else this.setColor(Categories.MISC as ColorResolvable);
	}
}

export default Embed;
