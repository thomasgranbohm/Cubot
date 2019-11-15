module.exports = {
	name: 'join',
	description: 'Joins your voice channel.',
	aliases: ['j'],
	color: '78fecf',
	execute(message, args) {
		new Promise((resolve, reject) => {
			if (message.member.voice) {
				message.member.voice.channel.join()
				message.client.queue.set(message.member.voice.guild.id, new Array());
				message.client.playing.set(message.member.voice.guild.id, undefined);
				return resolve();
			} else {
				message.reply("you need to join a voice channel to use this command.");
				return reject()
			}
		})
	},
};