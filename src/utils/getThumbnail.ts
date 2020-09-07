import { Bot } from "src";
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
				filestream.close();
				res(fullPath)
			})
		let resp = await axios.get(uri, {
			responseType: "stream"
		});
		resp.data.pipe(filestream);
	});
};

export default async function (client: Bot, track: TrackObject): Promise<string | null> {
	let resolutions = [
		'maxres',
		'sd',
		'hq',
		'mq',
	];

	for (let res of resolutions) {
		let path = resolve(process.env.PWD || __dirname, `./thumbnails/`);
		try {
			// TODO byt till egen image downloader
			let fullPath = await download(
				`https://i.ytimg.com/vi/${track.identifier}/${res}default.jpg`,
				path,
				`${track.identifier}-${res}.jpg`
			);

			// let offset = (img.getHeight() - (img.getWidth() * 9 / 16)) / 2;
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
				console.error("Other error", err)

			continue;
		}
	}
	return null;
}