import { AudioResource, createAudioResource } from '@discordjs/voice';
import { User } from 'discord.js';
import ytdl, { getBasicInfo } from 'ytdl-core';

export interface TrackData {
	creator: string;
	requester: User;
	title: string;
	thumbnail: string;
	url: string;
	onStart: (t: Track) => void;
}

class Track implements TrackData {
	creator: string;
	requester: User;
	resource: AudioResource<TrackData>;
	onStart: (t: Track) => void;
	title: string;
	thumbnail: string;
	url: string;

	constructor({
		url,
		onStart,
		creator,
		title,
		thumbnail,
		requester,
	}: TrackData) {
		this.creator = creator;
		this.requester = requester;
		this.title = title;
		this.thumbnail = thumbnail;
		this.url = url;

		this.onStart = () => onStart(this);
	}

	static async create(
		url: string,
		params: Pick<TrackData, 'onStart' | 'requester'>
	) {
		const info = await getBasicInfo(url);

		return new Track({
			creator: info.videoDetails.author.name,
			title: info.videoDetails.title,
			thumbnail: info.videoDetails.thumbnails.pop().url,
			url,
			...params,
		});
	}

	async createAudioResource(
		volume: number
	): Promise<AudioResource<TrackData>> {
		const process = ytdl(this.url, {
			filter: 'audioonly',
			requestOptions: {
				o: '-',
				q: '',
				f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
				r: '100K',
			},
		});

		this.resource = createAudioResource(process, {
			metadata: this,
			inlineVolume: true,
		});

		this.resource.volume.setVolume(volume);

		return this.resource;
	}

	getInfo() {
		return `[${this.title}](${this.url}) by ${this.creator}`;
	}
}

export default Track;
