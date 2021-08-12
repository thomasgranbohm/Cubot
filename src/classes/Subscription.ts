import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	createAudioPlayer,
	VoiceConnection,
} from '@discordjs/voice';
import { VolumeNotInRangeError } from '../errors';
import Track, { TrackData } from './Track';

export const LoopValues = ['all', 'first', undefined];

class Subscription {
	connection: VoiceConnection;
	current: Track;
	loop: typeof LoopValues[number];
	player: AudioPlayer;
	processing: boolean;
	queue: Track[];
	volume: number;

	constructor(connection: VoiceConnection) {
		this.connection = connection;
		this.loop = undefined;
		this.player = createAudioPlayer();
		this.processing = false;
		this.queue = [];
		this.volume = 1;

		this.player.on('stateChange', (oldState, newState) => {
			if (
				oldState.status !== AudioPlayerStatus.Idle &&
				newState.status === AudioPlayerStatus.Idle
			) {
				this.processQueue();
			} else if (newState.status === AudioPlayerStatus.Playing) {
				(
					newState.resource as AudioResource<TrackData>
				).metadata.onStart(this.current);
			}
		});

		this.connection.subscribe(this.player);
	}

	addToQueue(track: Track) {
		this.queue.push(track);
		this.processQueue();
		return this.queue;
	}

	nextLoop(): typeof LoopValues[number] {
		this.loop =
			LoopValues[(LoopValues.indexOf(this.loop) + 1) % LoopValues.length];
		this.processQueue();
		return this.loop;
	}

	setVolume(volume: number) {
		if (volume > 100 || volume < 0) throw VolumeNotInRangeError;
		this.volume = volume / 100;
		this.current.resource.volume.setVolume(this.volume);
	}

	processQueue() {
		if (
			this.processing ||
			(this.queue.length === 0 && this.loop === undefined) ||
			this.player.state.status !== AudioPlayerStatus.Idle
		)
			return;
		this.processing = true;

		if (this.loop === 'all') {
			this.queue.push(this.current);
		}

		if (this.loop !== 'first') {
			this.current = this.queue.shift();
		}

		try {
			const resource = this.current.createAudioResource(this.volume);
			this.player.play(resource);
			this.processing = false;
		} catch (error) {
			this.processing = false;
			return this.processQueue();
		}
	}
}

export default Subscription;
