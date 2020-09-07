import { Bot } from "../index";
import { Command } from "../classes/command";

export class Test extends Command {
	constructor(client: Bot) {
		super(client, {
			aliases: ['t'],
			group: 'misc',
			description: "This is a test command",
		});
	}

	async run(): Promise<string> {
		return "Test";
	}

}