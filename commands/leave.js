module.exports = {
	name: 'leave',
	description: 'Leaves your voice channel.',
	aliases: ['l'],
	color: '78fecf',
	execute(message = undefined, args, id = undefined, client = undefined) {
		new Promise((resolve, reject) => {

			//TODO FIXA SÅ ATT MAN KAN LÄMNA UTAN EN MEMBER CONNECTION
			if ((message && message.member.voiceChannel.connection) || (client && client.voiceConnections.get(id))) {
				if (client) {
					client.voiceConnections.get(id).channel.leave()

					client.queue.delete(id);
					client.playing.delete(id);
				} else {
					message.client.voiceConnections.get(message.member.guild.id).channel.leave()

					message.client.queue.delete(message.member.voiceChannel.id);
					message.client.playing.delete(message.member.voiceChannel.id);
				}

				return resolve();
			} else {
				message.reply("you need to join a voice channel to use this command.");
				return reject()
			}
		})
	},
};