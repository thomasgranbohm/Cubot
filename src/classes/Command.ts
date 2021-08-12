import { Message } from 'discord.js';
import { Categories } from '../constants';
import { MessageReturnType } from '../types';
import Embed from './Embed';

interface CommandOptions {
	name: string;
	description: string;
	category: Categories;
	aliases?: string[];
	needs_arguments?: boolean;
	no_delete?: boolean;
}

abstract class Command {
	names: string[];
	description: string;
	category: Categories;
	no_delete: boolean;
	needs_arguments?: boolean;
	aliases?: string[];

	constructor({
		name,
		description,
		category,
		aliases,
		needs_arguments,
		no_delete,
	}: CommandOptions) {
		this.names = [name];
		this.description = description;
		this.category = category;
		this.no_delete = no_delete;
		this.needs_arguments = needs_arguments;

		if (aliases) this.names.push(...aliases);
	}

	abstract run(
		message: Message,
		args?: string[]
	): MessageReturnType | Promise<MessageReturnType>;

	get name() {
		return this.names[0];
	}

	help(full = false): string | Embed {
		if (full) {
			return new Embed(this)
				.setTitle(this.name)
				.setDescription(this.description);
		}
		return `${this.name} - ${this.description}`;
	}
}

export default Command;