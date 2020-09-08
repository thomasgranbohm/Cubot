import { TrackObject } from "../types";
import { resolve } from "path";
import axios from "axios";
import { opendir, mkdir } from 'fs/promises';
import { createWriteStream } from "fs";
import sharp from "sharp";
import { writeFile } from "fs/promises";

let download = function (uri: string, path: string, filename: string): Promise<string> {
	return new Promise(async (res, rej) => {
		try {
			await opendir(path);
		} catch (err) {
			await mkdir(path);
		}

		let fullPath = resolve(path, filename);
		let filestream = await createWriteStream(fullPath)
			.on('finish', () => {
				filestream.end();
				res(fullPath)
			})

		try {
			let resp = await axios.get(uri, {
				responseType: "stream"
			});
			resp.data.pipe(filestream);
		} catch (error) {
			rej(error)
		}
	});
};

export default async function (track: TrackObject): Promise<string | null> {
	// TODO is weird. Called all over the place with no real consistancy
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

			await writeFile(fullPath, buffer, { flag: "w" });
			return fullPath;
		} catch (err) {
			if (!err.isAxiosError)
				console.error(err, "Not an axios error in thumbnails")
			continue;
		}
	}
	return null;
}