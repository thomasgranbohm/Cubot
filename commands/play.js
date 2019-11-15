const fs = require('fs');
const ytdl = require('ytdl-core');
const ytdldiscord = require('ytdl-core-discord');
const ytsearch = require('youtube-search');
const { youtubeToken, path } = require('../config.json');
const Discord = require('discord.js');
var Jimp = require('jimp');
const download = require('image-downloader')
const Entities = require('html-entities').AllHtmlEntities;
// const prism = require('prism-media');
const entities = new Entities();
let opts = {
	maxResults: 1,
	key: youtubeToken,
	type: "video"
}

let voiceID;

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
	args: true,
	aliases: ['p', 'add'],
	color: '78fecf',
	execute(message, args) {
		client = message.client;
		if (message.member.voice) {
			if (args.join(" ").includes("playlist?" || "list=")) {
				return message.reply("I don't support playlists yet...")
			}
			if (!message.client.voice.connections.get(message.member.voice.guild.id)) {
				message.client.commands
					.get("join")
					.execute(message, [])
			}
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

async function playItem(message, item) {
	clearTimeout(message.client.connectionTimeout.get(message.member.voice.guild.id));
	let connection = message.client.voice.connections.get(message.member.voice.guild.id)
	if (connection && message.client.playing.get(message.member.voice.guild.id) != undefined) {
		message.client.queue.get(message.member.voice.guild.id).push(item);

		console.log(`Added ${item.title} by ${item.channel} to the queue...`)
		let embed = new Discord.MessageEmbed()
			.setTitle(`${item.title}`)
			.setDescription(`by **${item.channel}**`)
			.setAuthor("Added to queue:", message.client.musicIcon)
			.attachFiles([{ attachment: item.thumbnail, name: "thumbnail.png" }])
			.setThumbnail(`attachment://thumbnail.png`)
			.setFooter(`Requested by ${item.requester.username}`, item.requester.avatarURL)
			.setColor(module.exports.color);
		message.channel.send(embed)
	}
	else {
		console.log(`Now playing ${item.title} by ${item.channel} with link ${item.link}`);

		voiceID = message.member.voice.guild.id;
		message.client.playing.set(voiceID, item);
		message.client.commands.get("now").execute(message, []);
		let stream = await ytdldiscord(item.link, {
			filter: 'audioonly',
			quality: "highestaudio",
			highWaterMark: 4 * 16384
		});
		stream.on('error', (error) => console.error(error))

		let dispatcher = message.client.voice.connections.get(message.member.voice.guild.id)
			.play(stream, { type: 'opus' })

		dispatcher.on('debug', (info) => console.log(info))
		dispatcher.on('error', (error) => console.error(error))

		dispatcher.on('end', () => {
			stream.destroy();
			message.client.playing.set(voiceID, undefined);
			if (message.client.queue.get(voiceID).length > 0) {
				console.log("Playing the next item...")
				playItem(message, message.client.queue.get(voiceID).shift())
			}
		});
		dispatcher.on('error', error => console.error(error))
	}
}

function searchYoutube(message, query) {
	let ytRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
	if (ytRegex.test(query)) {
		console.log(`Got a link: ${query}`)
		ytdl.getBasicInfo(query, (err, info) => {
			if (err) return console.log(err);
			searchYoutube(message, `${info.author.name} - ${info.player_response.videoDetails.title}`);
		});
	} else {
		console.log(`Searching YouTube for ${query}...`)

		ytsearch(query, opts, function (err, results) {
			if (err) return console.log(err.response)
			if (results.length > 0) {
				let thumbnailName = `${entities.encode(results[0].title.split(" ").join(""))}-${entities.encode(results[0].channelTitle.split(" ").join(""))}`.replace(/[^\w\s]/gi, '');
				thumbnailName += ".png"
				if (fs.existsSync(`${path}/downloads/${thumbnailName}`)) {
					playItem(
						message,
						new Item(
							results[0].link,
							entities.decode(results[0].title),
							entities.decode(results[0].channelTitle),
							`${path}/downloads/${thumbnailName}`,
							thumbnailName,
							message.author
						)
					);
				} else {
					download.image({
						url: results[0].thumbnails.high.url || results[0].thumbnails.standard.url || results[0].thumbnails.medium.url || results[0].thumbnails.default.url,
						dest: `${path}/downloads/${thumbnailName}`
					}).then(({ filename, image }) => {
						Jimp.read(filename)
							.then(image => {
								image.crop(0, 45, 480, 270)
									.write(filename);

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
			} else {
				message.reply(`I didn't find anything with the query \`${query}\`. Please try again!`);
			}
		});
	}
}

