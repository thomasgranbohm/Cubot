const jimp = require('jimp');
const download = require('image-downloader')

exports.util = {
	run(client, track) {
		return new Promise(async (resolve, rej) => {
			let res = [
				'maxres',
				'sd',
				'hq',
				'mq',
			]
			let dest;
			for await (let resolution of res) {
				dest = `${client.runningDir}/thumbnails/${track.info.identifier}-${resolution}.jpg`;
				try {
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
					console.general("Found thumbnail in ? default", resolution)
					break;
				} catch (err) {
					continue;
				}
			}
			resolve(dest)
		})
	}
}