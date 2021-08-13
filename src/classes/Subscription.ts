import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	createAudioPlayer,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus
} from '@discordjs/voice';
import { promisify } from 'util';
import { VolumeNotInRangeError } from '../errors';
import { error } from '../logger';
import { subscriptions } from './Bot';
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

		this.connection.on('stateChange', async (_, new_state) => {
			if (new_state.status === VoiceConnectionStatus.Disconnected) {
				if (
					new_state.reason ===
						VoiceConnectionDisconnectReason.WebSocketClose &&
					new_state.closeCode === 4014
				) {
					// This event also occurs when the bot is moved to another voice channel
					// TODO: Right now, it just disconnects.
					// try {
					// 	await entersState(
					// 		this.connection,
					// 		VoiceConnectionStatus.Connecting,
					// 		5_000
					// 	);
					// } catch {
					this.connection.destroy();
					// }
				} else if (this.connection.rejoinAttempts < 5) {
					await promisify(setTimeout)(
						(this.connection.rejoinAttempts + 1) * 5_000
					);
					this.connection.rejoin();
				} else {
					this.connection.destroy();
				}
			} else if (new_state.status === VoiceConnectionStatus.Destroyed) {
				this.stop();
			}
		});

		this.player.on('error', (err) => error(err));

		this.player.on('stateChange', (oldState, new_state) => {
			if (
				oldState.status !== AudioPlayerStatus.Idle &&
				new_state.status === AudioPlayerStatus.Idle
			) {
				this.processQueue();
			} else if (new_state.status === AudioPlayerStatus.Playing) {
				(
					new_state.resource as AudioResource<TrackData>
				).metadata.onStart(this.current);
			}
		});

		this.connection.subscribe(this.player);
	}

	stop() {
		this.processing = true;
		this.queue = [];
		this.player.stop(true);
		subscriptions.delete(this.connection.joinConfig.guildId);
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

	async processQueue() {
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
			const resource = await this.current.createAudioResource(
				this.volume
			);
			this.player.play(resource);
			this.processing = false;
		} catch (error) {
			this.processing = false;
			return this.processQueue();
		}
	}
}

export default Subscription;
