const { MessageEmbed } = require('discord.js')
const logger = require('../logger/')

module.exports = sendError = async (message, error) => {
    let { client } = message;
    if (process.env.NODE_ENV === 'production')
        (await client.dev.createDM())
            .send(
                new MessageEmbed()
                    .setTitle('Ran into some problems chief')
                    .setDescription(`**${message.author.tag}** tried to run \`${message.content}\` in ${message.guild.name}.\n\nHere is the stack trace:\n\`\`\`${error.stack}\`\`\``)
                    .setColor('RED')
                    .setTimestamp()
            )
    logger.error(error)
    let sentMessage = await message.channel.send(
        new MessageEmbed()
            .setTitle("Oops, an actual error...")
            .setDescription("Sorry about that. Please try again!\n\nRe-occuring issue? [Report it!](https://github.com/thomasgranbohm/CuBot/issues)")
            .attachFiles([
                { attachment: `${client.runningDir}/static/error.png`, name: `error.png` }
            ])
            .setColor('RED')
            .setFooter("")
            .setThumbnail('attachment://error.png')
    );

    sentMessage.delete({
        timeout: 10000
    })
}