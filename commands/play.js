// const fs = require('fs');
const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');
const { youtubeToken } = require('../config.json');

let opts = {
	maxResults: 1,
	key: youtubeToken
}

class Item {
	constructor(link, title, channel, thumbnail, requester) {
		this.link = link;
		this.title = title;
		this.channel = channel;
		this.thumbnail = thumbnail;
		this.requester = requester;
	}
}

module.exports = {
	name: 'play',
	description: 'Plays some music of your choice.',
	usage: '[search term]',
	execute(message, args) {
		if (message.member.voiceChannel) {
			if (args.length == 0) return message.reply("you need to send me a link to play.");
			message.member.voiceChannel.join()

			// let ytr = "/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/"

			searchYoutube(message, args.join(' '));
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};

function playYoutubeLink(message, item) {
	if (message.member.voiceChannel.connection.speaking) return message.client.queue.push(item);
	else {
		message.client.playing = item;
		let dispatcher = message.member.voiceChannel.connection.playStream(ytdl(item.link, { filter: 'audioonly' }));
		dispatcher.on('end', () => {
			if (message.client.queue.length > 0) {
				playYoutubeLink(message, message.client.queue.shift())
			} else {
				message.member.voiceChannel.leave(); 
				message.client.playing = undefined;
			}
		});
	}
}

function searchYoutube(message, query) {
	ytsearch(query, opts, function (err, results) {
		if (err) return console.log(err);

		playYoutubeLink(
			message, new Item(
				results[0].link,
				results[0].title,
				results[0].channelTitle,
				results[0].thumbnails.high.url || results[0].thumbnails.standard.url || results[0].thumbnails.medium.url || results[0].thumbnails.default.url,
				message.author
			)
		);
	});
}

