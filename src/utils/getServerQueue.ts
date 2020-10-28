import { Bot } from 'src';
import { TrackObject } from '../types';

export default function (client: Bot, guildId: string): TrackObject[] {
	return client.servers.get(guildId)?.queue.slice() || [];
}
