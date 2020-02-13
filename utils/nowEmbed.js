const { MessageEmbed, MessageAttachment } = require('discord.js')
const Canvas = require('canvas')

module.exports = nowEmbed = async (queue) => {
	let currentTrack = queue[0];

	// const XOFFSET = 25;
	// const YOFFSET = 0;
	// const BARHEIGHT = 10;
	// const canvas = Canvas.createCanvas(700, 2 * (BARHEIGHT + YOFFSET))
	// const c = canvas.getContext('2d');

	// const WIDTH = canvas.width
	// const HEIGHT = canvas.height

	// c.save();
	// c.beginPath();
	// c.fillStyle = '#999999';
	// c.arc(XOFFSET, HEIGHT / 2, BARHEIGHT / 2, Math.PI / 2, Math.PI * 3 / 2);
	// c.arc(WIDTH - XOFFSET, HEIGHT / 2, BARHEIGHT / 2, Math.PI * 3 / 2, Math.PI / 2);
	// c.fill();
	// c.restore();
	// c.beginPath();
	// c.arc(XOFFSET + (((Date.now() - currentTrack.startedAt) / currentTrack.info.length) * (WIDTH - 2 * XOFFSET)), HEIGHT / 2, BARHEIGHT, 0, Math.PI * 2)
	// c.fill()
	// c.save()
	// c.fillStyle = "#ffffff";
	// c.arc(XOFFSET + (((Date.now() - currentTrack.startedAt) / currentTrack.info.length) * (WIDTH - 2 * XOFFSET)), HEIGHT / 2, BARHEIGHT / 2, 0, Math.PI * 2)
	// c.fill()
	// c.restore();
	return new MessageEmbed()
		.setTitle("Now playing")
		.setDescription(`**[${currentTrack.info.title}](${currentTrack.info.uri})** by ${currentTrack.info.author}\n`)
		.attachFiles([
			{ attachment: currentTrack.thumbnail, name: `thumbnail.jpg` },
			// new MessageAttachment(canvas.toBuffer(), 'bar.png')
		])
		.setThumbnail(`attachment://thumbnail.jpg`)
		// .setImage('attachment://bar.png')
		.setFooter(`Track requested by ${currentTrack.requester.username}`, currentTrack.requester.avatarURL({ size: 1024 }))
}
