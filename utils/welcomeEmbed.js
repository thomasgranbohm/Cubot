const { MessageEmbed } = require('discord.js')
const { categories, prefix } = require("../config.json");

module.exports = welcomeEmbed = async (client, invitingUser) => {
    let welcomeEmbed = new MessageEmbed();

    let { commands, utils } = client;

    welcomeEmbed.setTimestamp()
        .setTitle(`Thanks for inviting me, ${invitingUser.username} :relaxed:`)
        .setDescription(
            `Here is a little something to help you get started.

My prefix is \`${prefix}\`, and use it like this \`${prefix}[command]\`

**These are my most essential commands:**
 - ${utils.getHelp(commands.boost)}
 - ${utils.getHelp(commands.invite)}
 - ${utils.getHelp(commands.now)}
 - ${utils.getHelp(commands.play)}
 - ${utils.getHelp(commands.skip)}
 - ${utils.getHelp(commands.volume)}
 - ${utils.getHelp(commands.weather)}

**Oh yea, I have equalizers, but only three at the moment.**
 - Flat
 - Boost
 - Earrape

To get the full list of commands, just run \`${prefix}${commands.help.name}\`.

The code is available on [my GitHub page](https://github.com/thomasgranbohm/CuBot).`
        )
        .setColor(categories.MISC)
        .setFooter(`Created by ${client.dev.username}`, client.dev.avatarURL());

    return welcomeEmbed;
}