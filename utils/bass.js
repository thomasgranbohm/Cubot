const fs = require('fs');
const ytdl = require('ytdl-core-discord');
const ytsearch = require('youtube-search');
const { youtubeToken, path } = require('../config.json');
const Discord = require('discord.js');
var Jimp = require('jimp');
const download = require('image-downloader')
const prism = require('prism-media');
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

let client;

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
    name: 'bass',
    description: 'Plays some music of your choice.',
    usage: '[search term]',
    aliases: ['b'],
    color: '78fecf',
    execute(message, args) {
        client = message.client;
        if (!message.member.voiceChannel.connection) {
            message.client.commands
                .get("join")
                .execute(message, [])
        }
        if (args.length == 0) return message.reply("you need to send me a link to play.");

        if (args.join(" ").endsWith('.mp3')) {

        } else {
            try {
                searchYoutube(message, args.join(' '));
            } catch (err) {
                throw err;
            }
        }
    },
};

async function playItem(message, item) {
    clearTimeout(message.client.connectionTimeout.get(message.member.voiceChannel.id));
    if (message.member.voiceChannel.connection.speaking) {
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
        message.delete(1000).catch(err => err);
    }
    else {
        console.log(`Now playing ${item.title} by ${item.channel}...`);
        message.client.playing.set(message.member.voiceChannel.id, item);
        message.client.commands.get("now").execute(message, []);
        const transcoder = new prism.FFmpeg({
            args: [
                '-af', "firequalizer=gain_entry='entry(0,24);entry(250,12);entry(1000,0);entry(4000,0);entry(16000,0)'"
            ],
        });
        const opus = new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 })
        const input = fs.createReadStream(`${path}/commands/test1.mp3`)//await ytdl(item.link, { filter: 'audioonly', quality: "highestaudio" });
        const stream = await input.pipe(transcoder).pipe(opus);

        console.log(stream)

        let dispatcher = message.member.voiceChannel.connection
            .playStream(stream);

        dispatcher.on('end', () => {
            if (message.client.queue.get(message.member.voiceChannel.id).length > 0) {
                playItem(message, message.client.queue.get(message.member.voiceChannel.id).shift())
            } else {
                message.member.client.playing.set(message.member.voiceChannel.id, undefined);
                // message.client.connectionTimeout.set(message.member.voiceChannel.id, setTimeout(() => {
                // 	message.client.commands.get("leave").execute(message, []);
                // }, 30 * 1000));
            }
        });
        dispatcher.on('volumeChange', (oldVolume, newVolume) => {
            let emoji = newVolume <= 0.1 ?
                ":mute:" :
                newVolume <= 0.4 ?
                    ":speaker:" :
                    newVolume <= 0.7 ?
                        ":musical_note:" :
                        newVolume <= 1 ?
                            ":notes:" :
                            newVolume > 1 ?
                                ":loudspeaker:"
                                : ":x:";
            // här har vi grejor
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

