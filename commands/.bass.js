const prism = require('prism-media');

module.exports = {
    name: 'bass',
    description: '**WARNING!** This doesn\'t work yet. Bass-boosts the playing song.',
    aliases: ['b'],
    color: '78fecf',
    execute(message, args) {
        let { connection } = message.member.voiceChannel
        if (connection && connection.dispatcher && connection.dispatcher.speaking) {
            console.log("bassboosting")
            let { stream, transcoder, encoder } = message.client.playing.get(message.member.voiceChannel.id);
            const otherTranscoder = new prism.FFmpeg({
                args: [
                    '-analyzeduration', '0',
                    '-loglevel', '0',
                    '-f', 's16le',
                    '-ar', '48000',
                    '-ac', '2',
                    '-af', 'volume=30dB'//'equalizer=f=1000:width_type=h:width=600:g=10',
                ],
            });
            message.client.playing.get(message.member.voiceChannel.id).stream.pipe(otherTranscoder);

            otherTranscoder.on('error', (err) => console.error(err))
            otherTranscoder.once('data', () => {
                otherTranscoder.pipe(encoder)
                encoder.on('error', (err) => console.err(err))
                encoder.once('data', (data) => {
                    console.log(data)
                    message.member.voiceChannel.connection.playOpusStream(message.client.playing.get(message.member.voiceChannel.id).stream)
                })
            })
        } else {
            message.client.utils.get("notPlaying").execute(message);
        }

    },
};

