import axios from "axios";
import { TrackObject } from "../types";
import { LavalinkConfig } from "../config";

export default async function (query: string): Promise<TrackObject[]> {
	try {
		const res = await axios.get(
			`http://${LavalinkConfig.host}:${LavalinkConfig.port}/loadtracks?identifier=${encodeURIComponent(query)}`,
			{
				headers: {
					Authorization: LavalinkConfig.password
				}
			}
		);
		return res.data.tracks.map((t: any) => {
			return { ...t.info, track: t.track } as TrackObject
		});
	} catch (error) {
		console.error(error, `http://${LavalinkConfig.host}:${LavalinkConfig.port}/loadtracks?identifier=${encodeURIComponent(query)}`, "wtf")
		return new Array<TrackObject>();
	}

}