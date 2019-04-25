module.exports = {
	name: 'leave',
	description: 'Leaves your voice channel.',
	aliases: ['l'],
	color: '78fecf',
	execute(message, args) {
        new Promise((resolve, reject) => {
            if (message.member.voiceChannel.connection) {
                message.client.queue.delete(message.member.voiceChannel.id);
                message.client.playing.delete(message.member.voiceChannel.id);
                message.member.voiceChannel.leave();
                return resolve();
            } else {
                message.reply("you need to join a voice channel to use this command.");
                return reject()
            }
        })
	},
};