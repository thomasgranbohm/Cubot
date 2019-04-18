const fs = require('fs');
const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');
const { youtubeToken, path } = require('../config.json');
const Discord = require('discord.js');
var Jimp = require('jimp');
const download = require('image-downloader')
const Entities = require('html-entities').AllHtmlEntities;


const entities = new Entities();

let opts = {
	maxResults: 1,
	key: youtubeToken,
	type: "video"
}

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
		if (message.member.voiceChannel) {
			if (args.length == 0) return message.reply("you need to send me a link to play.");
			message.member.voiceChannel.join()

			try {
				searchYoutube(message, args.join(' '));
			} catch (err) {
				throw err;
			}
		} else {
			return message.reply("you need to join a voice channel to use this command.");
		}
	},
};

function playYoutubeLink(message, item) {
	if (message.member.voiceChannel.connection.speaking) {
		message.client.queue.push(item);
		console.log(`Added ${item.title} by ${item.channel} to the queue...`)
		let embed = new Discord.RichEmbed()
			.setTitle(`${item.title}`)
			.setDescription(`by **${item.channel}**`)
			.setAuthor("Added to queue:", message.client.icon)
			.attachFiles([{ attachment: item.thumbnail, name: item.thumbnailName }])
			.setThumbnail(`attachment://${item.thumbnailName}`)
			.setFooter(`Requested by ${item.requester.username}`, item.requester.avatarURL)
			.setColor(this.color);
		return message.channel.send(embed);
	}
	else {
		console.log(`Now playing ${item.title} by ${item.channel}...`);
		message.client.playing = item;
		message.client.commands.get("now").execute(message, []);
		let dispatcher = message.member.voiceChannel.connection.playStream(ytdl(item.link, { filter: 'audioonly', quality: "highestaudio" }));
		dispatcher.on('end', () => {
			if (message.client.queue.length > 0) {
				playYoutubeLink(message, message.client.queue.shift())
			} else {
				message.member.voiceChannel.leave();
				message.client.playing = undefined;
			}
		});
		dispatcher.on('volumeChange', (oldVolume, newVolume) => {
			let emoji = newVolume <= 0.1 ?
				":mute:" :
				newVolume <= 0.4 ?
					":speaker:" :
					newVolume <= 0.7 ?
						":musical_note" :
						newVolume <= 1 ?
							":notes:" :
							newVolume > 1 ?
								"loudspeaker"
								: ":x:";
								// här har vi grejor§
			message.channel.send(`${emoji} Changed volume from ${oldVolume * 100}% to ${newVolume * 100}%!`)
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
				playYoutubeLink(
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

							playYoutubeLink(
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

