const Discord = require('discord.js');

module.exports = {
	name: 'now',
	description: 'Displays the playing song.',
	aliases: ["np", "nowplaying", "playing"],
	color: "ee7674",
	async execute(message, args) {
		if (message.member.voiceChannel && message.client.playing.get(message.member.voiceChannel.id) != undefined) {
			const { playing } = message.client;
			let embed = new Discord.RichEmbed()
				.setAuthor("Currently playing:", message.client.icon, playing.get(message.member.voiceChannel.id).link)
				.setTitle(`**${playing.get(message.member.voiceChannel.id).title}**`)
				.setDescription(`by **${playing.get(message.member.voiceChannel.id).channel.toString()}**`)
				.attachFiles([{ attachment: playing.get(message.member.voiceChannel.id).thumbnail, name: "ok.png" }])
				.setThumbnail(`attachment://ok.png`)
				.setFooter(`Requested by ${playing.get(message.member.voiceChannel.id).requester.username}`, playing.get(message.member.voiceChannel.id).requester.displayAvatarURL)
				.setColor(this.color)

			message.channel.send({ embed })
				.then(sentMessage => sentMessage.delete(15000));
		} else {
			message.client.utils.get("notPlaying").execute(message);
		}
	},
};
