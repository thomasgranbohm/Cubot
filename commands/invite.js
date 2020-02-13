const { categories } = require('../config.json');
const { MessageEmbed } = require('discord.js');

let invite = async (message, args) => {

	const { client } = message;
	const { commands, utils } = client;
	let link = await client.generateInvite(["CREATE_INSTANT_INVITE", "ADD_REACTIONS", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "USE_VAD", "CHANGE_NICKNAME"])
	let DMChannel = await message.author.createDM();
	DMChannel.send(
		new MessageEmbed()
			.setTitle("Here is an invite")
			.setDescription(link)
			.setTimestamp()
			.setColor(categories.MISC)
	);
	return new MessageEmbed()
		.setTitle('Check your DM\'s for an invite :grin:')
}
invite.shortDesc = 'Generates an invite for this bot.';
invite.args = false;
invite.aliases = ['i'];
invite.category = categories.MISC;

module.exports = invite;