import {
	ApplicationCommandData,
	ApplicationCommandOptionData,
	ButtonInteraction,
	CommandInteraction,
} from 'discord.js';
import { MessageReturnType } from '../types';

abstract class CustomInteraction implements ApplicationCommandData {
	name: string;
	description: string;
	options?: ApplicationCommandOptionData[];
	defaultPermission?: boolean;

	constructor({
		name,
		description,
		defaultPermission,
		options,
	}: ApplicationCommandData) {
		this.name = name;
		this.description = description;
		this.defaultPermission = defaultPermission;
		this.options = options;
	}

	abstract run(
		interaction: ButtonInteraction | CommandInteraction
	): MessageReturnType | Promise<MessageReturnType>;
}

export default CustomInteraction;
