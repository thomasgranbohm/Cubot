import {
	AudioPlayer,
	AudioPlayerStatus,
	createAudioPlayer,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { promisify } from 'util';
import { VolumeNotInRangeError } from '../errors';
import { debug, error } from '../logger';
import { subscriptions } from './Bot';
import Track from './Track';

export const LoopValues = ['all', 'first', undefined];

class Subscription {
	connection: VoiceConnection;
	current: Track;
	loop: typeof LoopValues[number];
	player: AudioPlayer;
	previous: Track;
	processing: boolean;
	queue: Track[];
	volume: number;

	constructor(connection: VoiceConnection) {
		this.connection = connection;
		this.loop = undefined;
		this.player = createAudioPlayer();
		this.previous = undefined;
		this.processing = false;
		this.queue = [];
		this.volume = 1;

		this.connection.on('stateChange', async (_, new_state) => {
			debug('New connection state:', new_state.status);
			if (new_state.status === VoiceConnectionStatus.Disconnected) {
				if (
					new_state.reason ===
						VoiceConnectionDisconnectReason.WebSocketClose &&
					new_state.closeCode === 4014
				) {
					// TODO: This event also occurs when the bot is moved to another voice channel
					// Right now, it just disconnects.
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

		this.player.on('stateChange', (old_state, new_state) => {
			debug('New player state:', new_state.status);
			if (
				old_state.status !== AudioPlayerStatus.Idle &&
				new_state.status === AudioPlayerStatus.Idle
			) {
				// Track ended
				this.previous = this.current;
				this.current = null;
				this.processQueue();
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

	setLoop(new_loop: typeof LoopValues[number]) {
		this.loop = new_loop;
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

		if (this.loop === 'first') {
			this.current = this.previous;
		} else {
			if (this.loop === 'all') {
				this.queue.push(this.previous);
			}
			this.current = this.queue.shift();
		}

		try {
			const resource = await this.current.createAudioResource(
				this.volume
			);
			this.player.play(resource);
			this.processing = false;
		} catch (err) {
			this.processing = false;
			error(err);
			return this.processQueue();
		}
	}
}

export default Subscription;
