const Command = require("./command.js");
module.exports = class Play extends Command {
	constructor() {
		super();

		this.name = 'skip';
		this.usage += `${this.name}`;
		this.description = 'Skips the playing track.';
		this.args = false;
		this.aliases = ['s'];
		this.category = 'voice';
	}

	run = (message, args) => {
		let client = message.client;
		if (!message.member.voice.channelID)
			message.channel.send("You are not in a voice channel.")

		if (client.player.get(message.guild.id) && message.member.voice.channelID !== guild.player.get(message.guild.id))
			message.channel.send("I'm already in another voice channel.")

		let queue = client.getServerQueue(message.guild.id)
		if (!queue || queue.length == 0)
			message.channel.send("I'm not playing anything.")

		queue.splice(0, 1);
		client.player.get(message.guild.id).stop();
	}
}