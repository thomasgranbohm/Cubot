import axios from 'axios';
import * as logger from '../logger';
import { TrackObject } from '../types';

export default async function (track: TrackObject): Promise<string | null> {
	if (!track.uri.includes('youtube') || typeof track.thumbnail === 'string') {
		return null;
	}

	for (let res of ['maxres', 'mq']) {
		try {
			let fullPath = `https://i.ytimg.com/vi_webp/${track.identifier}/${res}default.webp`;
			await axios.get(fullPath);
			return fullPath;
		} catch (err) {
			if (!err.isAxiosError)
				logger.error(err, 'Not an axios error in thumbnails');
			continue;
		}
	}
	return null;
}
