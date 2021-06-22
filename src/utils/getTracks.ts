import axios from 'axios';
import { Guild } from 'discord.js';
import { LavalinkConfig } from '../config';
import { TrackObject } from '../types';

export default async function (
	query: string,
	guild: Guild
): Promise<TrackObject[]> {
	try {
		const res = await axios.get(
			`http://${LavalinkConfig.host}:${
				LavalinkConfig.port
			}/loadtracks?identifier=${encodeURIComponent(query)}`,
			{
				headers: {
					Authorization: LavalinkConfig.password,
				},
			}
		);
		return res.data.tracks.map((t: any) => {
			return { ...t.info, track: t.track, guild } as TrackObject;
		});
	} catch (error) {
		console.error(
			error,
			`http://${LavalinkConfig.host}:${
				LavalinkConfig.port
			}/loadtracks?identifier=${encodeURIComponent(query)}`,
			'wtf'
		);
		return new Array<TrackObject>();
	}
}
