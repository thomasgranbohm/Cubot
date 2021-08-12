import { AudioResource, createAudioResource } from '@discordjs/voice';

export interface TrackData {
	title: string;
	creator: string;
	url: string;
	onStart: (t: Track) => void;
}

class Track implements TrackData {
	readonly title: string;
	readonly creator: string;
	resource: AudioResource<TrackData>;
	readonly url: string;
	onStart: (t: Track) => void;

	constructor({ creator, title, url, onStart }: TrackData) {
		this.creator = creator;
		this.title = title;
		this.url = url;

		this.onStart = () => onStart(this);
	}

	createAudioResource(volume: number) {
		this.resource = createAudioResource<TrackData>(
			'https://granbohm.dev/misc/banger_3_short.flac',
			{
				metadata: this,
				inlineVolume: true,
			}
		);

		this.resource.volume.setVolume(volume);

		return this.resource;
	}

	getInfo() {
		return `[${this.title}](${this.url}) by ${this.creator}`;
	}
}

export default Track;
