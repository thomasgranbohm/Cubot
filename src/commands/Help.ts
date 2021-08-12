import { Message } from 'discord.js';
import { commands, prefix } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import { Categories } from '../constants';

class Help extends Command {
	constructor() {
		super({
			name: 'help',
			description:
				'Gets help about a command or command category, or a list of all commands.',
			category: Categories.MISC,
			aliases: ['h'],
		});
	}

	run(_: Message, args: string[]) {
		if (!args || args.length === 0) {
			return {
				embeds: [
					new Embed(this)
						.setTitle('List of all commands:')
						.setDescription(
							[
								commands
									.sort((a, b) =>
										a.name.localeCompare(b.name)
									)
									.map(
										(v) =>
											`**${v.name}** - ${v.description}`
									)
									.join('\n'),
								`**Prefix in this guild:** \`${prefix}\``,
							].join('\n\n')
						),
				],
			};
		}

		const query = args.shift();
		const o = commands.find((c) => c.names.includes(query));
		if (!o) return null;
		return {
			embeds: [
				new Embed(this)
					.setTitle(`Detailed information about ${o.name}`)
					.addField('Description', o.description)
					.addField('Aliases', o.names.slice(1).join('\n'), true)
					.addField(
						'Needs arguments',
						o.needs_arguments ? 'True' : 'False',
						true
					),
			],
		};
	}
}

export default Help;
