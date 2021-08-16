import {
	ApplicationCommandData,
	ApplicationCommandOptionData,
	ButtonInteraction,
	CommandInteraction,
} from 'discord.js';
import { Categories } from '../constants';
import { MessageReturnType } from '../types';

interface CustomInteractionOptions extends ApplicationCommandData {
	category: Categories;
}

abstract class CustomInteraction implements CustomInteractionOptions {
	name: string;
	description: string;
	category: Categories;
	options?: ApplicationCommandOptionData[];
	defaultPermission?: boolean;

	constructor({
		name,
		description,
		category,
		defaultPermission,
		options,
	}: CustomInteractionOptions) {
		this.name = name;
		this.description = description;
		this.category = category;
		this.options = options;
		this.defaultPermission = defaultPermission;
	}

	abstract run(
		interaction: ButtonInteraction | CommandInteraction
	): MessageReturnType | Promise<MessageReturnType>;
}

export default CustomInteraction;
