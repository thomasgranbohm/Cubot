import { TrackObject } from "../types";
import { resolve } from "path";
import axios from "axios";
import { promises as fs, writeFileSync, createWriteStream } from 'fs';
import sharp from "sharp";

let download = function (uri: string, path: string, filename: string): Promise<string> {
	return new Promise(async (res, rej) => {
		try {
			await fs.mkdir(path);
		} catch (err) { }

		let fullPath = resolve(path, filename);
		try {
			let resp = await axios.get(uri, {
				responseType: "stream"
			});
			let filestream = await createWriteStream(fullPath)
				.on('finish', () => {
					filestream.end();
					res(fullPath)
				})

			resp.data.pipe(filestream);
		} catch (error) {
			rej(error)
		}
	});
};

export default async function (track: TrackObject): Promise<string | null> {
	if (!track.uri.includes("youtube") || typeof track.thumbnail === "string")
		return null;
	let resolutions = [
		'maxres',
		'sd',
		'hq',
		'mq',
	];

	for (let res of resolutions) {
		let path = resolve(process.env.PWD || __dirname, `./thumbnails/`);
		try {
			let fullPath = await download(
				`https://i.ytimg.com/vi/${track.identifier}/${res}default.jpg`,
				path,
				`${track.identifier}-${res}.jpg`
			);

			let buffer = await sharp(fullPath)
				.resize({
					width: 1600,
					height: 900,
					fit: "cover"
				})
				.jpeg()
				.toBuffer();

			await writeFileSync(fullPath, buffer, { flag: "w" });
			return fullPath;
		} catch (err) {
			if (!err.isAxiosError)
				console.error(err, "Not an axios error in thumbnails")
			continue;
		}
	}
	return null;
}
