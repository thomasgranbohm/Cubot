const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'init',
    description: 'Choose a Text Channel.',
    color: "e63462",
    execute(message, args) {
        fs.readFile('./config.json', (err, data) => {
            if (err) return console.error(err);
            let json = JSON.parse(data)
            let serverObj = {
                serverID: message.channel.guild.id,
                textChannelID: message.channel.id
            }
            if (json.initializedTextChannels.filter(obj => {
                    return obj.serverID == serverObj.serverID && obj.textChannelID != serverObj.textChannelID
                }).length != 0) {
                console.log("Server already exists")
                json.initializedTextChannels.splice(
                    json.initializedTextChannels.indexOf(serverObj), 1
                );
                message.reply("I've changed your default Text Channel.")
                    .then(sentMessage => sentMessage.delete(10000));
            } else {
                message.reply("I've initialized this as your default Text Channel.")
                    .then(sentMessage => sentMessage.delete(10000));
            }
            json.initializedTextChannels.push(serverObj);
            fs.writeFile('./config.json', JSON.stringify(json, null, 4), (err) => {
                if (err) return console.error(err);
            });
        })
    },
};