const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

let queue = async (message, args) => {
	const { client } = message;
	const { commands, utils } = client;

	let userCheckFail = await utils.checkUserVoice(message);
	if (userCheckFail) return userCheckFail;
	let botCheckFail = await utils.checkBotVoice(message);
	if (botCheckFail) return botCheckFail;

	let queue = utils.getServerQueue(client, message.guild.id).slice();
	if (queue.length === 0) return "I'm not playing anything.";
	let currentlyPlaying = queue.shift();
	let tracks = queue.map((track) => {
		return {
			title: track.info.title,
			uri: track.info.uri,
			author: track.info.author,
		};
	});

	//TODO send now playing if queue is 1
	// and send queue with the current track if more than 1

	let toSend = new MessageEmbed()
		.setTitle(`Queue for ${message.guild.name}`)
		.setDescription(
			`**[Currently playing](${currentlyPlaying.info.uri})**\n - **${currentlyPlaying.info.title}** by ${currentlyPlaying.info.author}`,
		)
		.setFooter(
			`Track requested by ${currentlyPlaying.requester.username}`,
			currentlyPlaying.requester.avatarURL({ size: 1024 }),
		)
		.attachFiles([
			{ attachment: currentlyPlaying.thumbnail, name: `thumbnail.jpg` },
		])
		.setThumbnail(`attachment://thumbnail.jpg`);
	// TODO Canvas bar.
	if (queue.length !== 0) {
		toSend
			.addField(
				'**Titles**',
				tracks
					.map(
						(track) =>
							`\`${tracks.indexOf(track) + 1}.\` [${
							track.title
							}](${track.uri})`,
					)
					.join('\n'),
				true,
			)
			.addField(
				'**Channel**',
				tracks.map((track) => track.author).join('\n'),
				true,
			);
	} else {
		toSend.setDescription(toSend.description + `\n\nThe queue is empty.`);
	}
	return toSend;
};
queue.shortDesc = 'Lists the tracks queued on this server.';
queue.args = false;
queue.aliases = ['q', 'que', 'list'];
queue.category = categories.VOICE;
queue.allowedChannels = ['text']

module.exports = queue;
