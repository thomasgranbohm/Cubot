module.exports = {
	name: 'leave',
	description: 'Leaves your voice channel.',
	aliases: ['l'],
	color: '78fecf',
	execute(message = undefined, args, id = undefined, client = undefined) {
		new Promise((resolve, reject) => {

			//TODO FIXA SÅ ATT MAN KAN LÄMNA UTAN EN MEMBER CONNECTION
			if ((message && message.client.voice.connections.get(message.member.voice.guild.id)) || (client && client.voice.connections.get(id))) {
				if (client) {
					client.voice.connections.get(id).channel.leave()

					client.queue.delete(id);
					client.playing.delete(id);
				} else {
					message.client.voice.connections.get(message.member.guild.id).channel.leave()

					message.client.queue.delete(message.member.voice.guild.id);
					message.client.playing.delete(message.member.voice.guild.id);
				}

				return resolve();
			} else {
				message.reply("you need to join a voice channel to use this command.");
				return reject()
			}
		})
	},
};