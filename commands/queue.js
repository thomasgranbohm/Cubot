module.exports = {
	name: 'queue',
	description: 'List all songs in the queue.',
	execute(message, args) {
		message.reply(message.client.queue.map(link => `${message.client.queue.indexOf(link)}. <${link}>\n`));
	},
};