import { GuildMember, Interaction } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import CustomInteraction from '../classes/Interaction';
import Subscription from '../classes/Subscription';
import Voice from '../namespaces/Voice';

class JoinInteraction extends CustomInteraction {
	constructor() {
		super({
			name: 'join',
			description: 'Joins your voice channel.',
		});
	}

	async run(interaction: Interaction) {
		if (!interaction.isCommand()) return;
		const channel = (interaction.member as GuildMember).voice.channel;
		const connection = await Voice.create(channel);

		subscriptions.set(interaction.guildId, new Subscription(connection));

		await interaction.reply({
			content: 'Joined voice channel!',
			ephemeral: true,
		});
	}
}

export default JoinInteraction;
