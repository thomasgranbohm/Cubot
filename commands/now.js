const Discord = require('discord.js');

module.exports = {
    name: 'now',
    description: 'Displays the playing song.',
    alias: ["np", "nowplaying", "playing"],
    execute(message, args) {
        if (message.member.voiceChannel && message.member.voiceChannel.connection.speaking) {
            let embed = new Discord.RichEmbed()
                .setAuthor("Currently playing:")
                .setTitle(`${message.client.playing.title} by ${message.client.playing.channel}`)
                .setURL(message.client.playing.link)
                .setThumbnail(message.client.playing.thumbnail)
                .setFooter(`Requested by ${message.client.playing.requester.username}`, message.client.playing.requester.displayAvatarURL);
            console.log(message.client.playing.requester.displayAvatarURL)

            return message.channel.send({ embed });
        } else {
            return message.reply("nothing is currently playing.");
        }
    },
};