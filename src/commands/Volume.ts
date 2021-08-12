import { Message } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import { Categories } from '../constants';
import { BotNotInVoiceChannelError } from '../errors';

class Volume extends Command {
	constructor() {
		super({
			name: 'volume',
			description: 'Check or set the playing volume.',
			category: Categories.VOICE,
			aliases: ['v', 'vol'],
		});
	}

	run(message: Message, args: string[]) {
		const subscription = subscriptions.get(message.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		const new_volume = args.shift();
		if (Number(new_volume)) {
			subscription.setVolume(Number(new_volume));

			return {
				embeds: [new Embed(this).setTitle(`New volume: ${new_volume}`)],
			};
		}
		return null;
	}
}

export default Volume;
