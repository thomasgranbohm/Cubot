const Util = require('./util.js');
const download = require('image-downloader')
const jimp = require('jimp')
module.exports = class getThumbnail extends Util {
	constructor() {
		super();

		this.name = 'getThumbnail';
	}
	run = (client, track) => {
		return new Promise(async (resolve, rej) => {
			let res = [
				'maxres',
				'sd',
				'hq',
				'mq',
			]
			for await (let resolution of res) {
				let dest = `${client.runningDir}/thumbnails/${track.info.identifier}-${resolution}.jpg`;
				try {
					console.log(`https://i.ytimg.com/vi/${track.info.identifier}/${resolution}default.jpg`);
					let img = await jimp.read(
						(await download.image({
							url: `https://i.ytimg.com/vi/${track.info.identifier}/${resolution}default.jpg`,
							dest: dest
						})).filename
					);
					let offset = (img.getHeight() - (img.getWidth() * 9 / 16)) / 2;
					img
						.quality(100)
						.crop(0, offset, img.getWidth(), img.getHeight() - (2 * offset))
						.write(dest);
					console.log("Found thumbnail in", resolution, "default")
					track.thumbnail = dest;
					break;
				} catch (err) {
					continue;
				}
			}
			resolve(track)
		})
	}
}