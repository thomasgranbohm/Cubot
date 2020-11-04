import { MessageEmbed } from 'discord.js';
import { Bot } from 'src';
import { flat } from '../equalizers';
import { NotPlayingError } from '../errors';
import { Equalizer } from '../types';

export default async function (
	client: Bot,
	guildId: string,
	equalizer: Equalizer
) {
	const player = client.manager.players.get(guildId);

	if (!player) throw new NotPlayingError();

	let server = client.servers.get(guildId);
	if (!server) throw new NotPlayingError();

	let currentEqualizer = server?.equalizer;

	const newEqualizer =
		currentEqualizer !== equalizer ? equalizer : flat;
	await player.equalizer(newEqualizer.bands);

	client.servers.set(guildId, {
		...server,
		equalizer: newEqualizer,
	});

	return new MessageEmbed().setTitle(
		`Changing equalizer to ${newEqualizer.name}...`
	);
}
