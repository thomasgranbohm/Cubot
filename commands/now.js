const Discord = require('discord.js');

module.exports = {
	name: 'now',
	description: 'Displays the playing song.',
	aliases: ["np", "nowplaying", "playing"],
	color: "ee7674",
	async execute(message, args) {
		if (message.member.voice && message.client.playing.get(message.member.voice.guild.id) != undefined) {
			const { playing } = message.client;
			let embed = new Discord.MessageEmbed()
				.setAuthor("Currently playing:", message.client.musicIcon, playing.get(message.member.voice.guild.id).link)
				.setTitle(`**${playing.get(message.member.voice.guild.id).title}**`)
				.setDescription(`by **${playing.get(message.member.voice.guild.id).channel.toString()}**`)
				.attachFiles([{ attachment: playing.get(message.member.voice.guild.id).thumbnail, name: "ok.png" }])
				.setThumbnail(`attachment://ok.png`)
				.setFooter(`Requested by ${playing.get(message.member.voice.guild.id).requester.username}`, playing.get(message.member.voice.guild.id).requester.avatarURL({ format: "gif", size: 1024 }))
				.setColor(this.color)

			message.channel.send({ embed })
		} else {
			message.client.utils.get("notPlaying").execute(message);
		}
	},
};
