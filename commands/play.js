const fs = require('fs');
const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');
const { youtubeToken, path } = require('../config.json');
const Discord = require('discord.js');
var Jimp = require('jimp');
const download = require('image-downloader')
const Entities = require('html-entities').AllHtmlEntities;
const prism = require('prism-media');

const entities = new Entities();

let client;

let opts = {
	maxResults: 1,
	key: youtubeToken,
	type: "video"
}

let voiceChannelID;

class Item {
	constructor(link, title, channel, thumbnail, thumbnailName, requester) {
		this.link = link;
		this.title = decodeURI(title);
		this.channel = decodeURI(channel);
		this.thumbnail = thumbnail;
		this.thumbnailName = thumbnailName
		this.requester = requester;
	}
}

module.exports = {
	name: 'play',
	description: 'Plays some music of your choice.',
	usage: '[search term]',
	aliases: ['p', 'add'],
	color: '78fecf',
	execute(message, args) {
		client = message.client;
		if (message.member.voiceChannel) {
			if (!message.member.voiceChannel.connection) {
				message.client.commands
					.get("join")
					.execute(message, [])
			}
			if (args.length == 0) args = "the office intro".split(" ")//return message.reply("you need to send me a link to play.");

			if (args.join(" ").endsWith('.mp3')) {

			} else {
				try {
					searchYoutube(message, args.join(' '));
				} catch (err) {
					throw err;
				}
			}
		} else {
			message.reply("you need to join a Voice Channel to use that.")
		}
	},
};

function playItem(message, item) {
	clearTimeout(message.client.connectionTimeout.get(message.member.voiceChannel.id));
	if (message.member.voiceChannel && message.member.voiceChannel.connection && message.member.voiceChannel.connection.speaking) {
		message.client.queue.get(message.member.voiceChannel.id).push(item);

		console.log(`Added ${item.title} by ${item.channel} to the queue...`)
		let embed = new Discord.RichEmbed()
			.setTitle(`${item.title}`)
			.setDescription(`by **${item.channel}**`)
			.setAuthor("Added to queue:", message.client.icon)
			.attachFiles([{ attachment: item.thumbnail, name: "thumbnail.png" }])
			.setThumbnail(`attachment://thumbnail.png`)
			.setFooter(`Requested by ${item.requester.username}`, item.requester.avatarURL)
			.setColor(module.exports.color);
		message.channel.send(embed)
			.then(sentMessage => sentMessage.delete(15000));
	}
	else {
		console.log(`Now playing ${item.title} by ${item.channel}...`);

		voiceChannelID = message.member.voiceChannel.id;
		message.client.playing.set(voiceChannelID, item);
		message.client.commands.get("now").execute(message, []);
		let dispatcher = message.member.voiceChannel.connection
			.playStream(ytdl(item.link, {
				filter: 'audioonly',
				quality: "highestaudio",
				highWaterMark: 16384 * 64,
			}))

		dispatcher.on('end', () => {
			if (message.client.queue.get(voiceChannelID).length > 0) {
				playItem(message, message.client.queue.get(voiceChannelID).shift())
			} else {
				message.client.playing.set(voiceChannelID, undefined);
			}
		});
		dispatcher.on('volumeChange', (oldVolume, newVolume) => {
			message.client.utils.get("getVolume").execute(message, oldVolume);
		});
	}
}

function searchYoutube(message, query) {
	let ytRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
	if (ytRegex.test(query)) {
		console.log(`Got a link: ${query}`)
		ytdl.getBasicInfo(query, (err, info) => {
			if (err) return console.log(err);
			searchYoutube(message, `${info.author.name} - ${info.title}`);
		});
	} else {
		console.log(`Searching YouTube for ${query}...`)

		ytsearch(query, opts, function (err, results) {
			if (err) return (err)
			let thumbnailName = `${entities.encode(results[0].title.split(" ").join(""))}-${entities.encode(results[0].channelTitle.split(" ").join(""))}`.replace(/[^\w\s]/gi, '');
			thumbnailName += ".png"
			if (fs.existsSync(`${path}/downloaded/${thumbnailName}`)) {
				playItem(
					message,
					new Item(
						results[0].link,
						entities.decode(results[0].title),
						entities.decode(results[0].channelTitle),
						`${path}/downloaded/${thumbnailName}`,
						thumbnailName,
						message.author
					)
				);
			} else {
				download.image({
					url: results[0].thumbnails.high.url || results[0].thumbnails.standard.url || results[0].thumbnails.medium.url || results[0].thumbnails.default.url,
					dest: `${path}/downloaded/${thumbnailName}`
				}).then(({ filename, image }) => {
					Jimp.read(filename)
						.then(image => {
							image.crop(0, 45, 480, 270) // resize
								.write(filename); // save

							playItem(
								message,
								new Item(
									results[0].link,
									entities.decode(results[0].title),
									entities.decode(results[0].channelTitle),
									filename,
									thumbnailName,
									message.author
								)
							);
						})
						.catch(err => {
							console.error(err);
						});
				}).catch((err) => {
					console.error(err)
				});
			}
		});
	}
}

