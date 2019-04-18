const Discord = require('discord.js');

module.exports = {
    name: 'now',
    description: 'Displays the playing song.',
    aliases: ["np", "nowplaying", "playing"],
    color: "ee7674",
    async execute(message, args) {
        if (message.member.voiceChannel && message.client.playing != undefined) {
            let embed = new Discord.RichEmbed()
                .setAuthor("Currently playing:", message.client.icon, message.client.playing.link)
                .setTitle(`**${message.client.playing.title}**`)
                .setDescription(`by **${message.client.playing.channel.toString()}**`)
                .attachFiles([{ attachment: message.client.playing.thumbnail, name: message.client.playing.thumbnailName}])
                .setThumbnail(`attachment://${message.client.playing.thumbnailName}`)
                .setFooter(`Requested by ${message.client.playing.requester.username}`, message.client.playing.requester.displayAvatarURL)
                .setColor(this.color)

            message.channel.send({ embed })
            message.delete(1000).catch(err => err)
        } else {
			message.reply('I\'m not currently playing anything. You can use `play` to make me play something!')
		}
    },
};
