import { Bot } from 'src';
import { NoGuildFoundError } from '../errors';
import { TrackObject } from '../types';

export default function (
	client: Bot,
	guildId: string,
	newQueue: TrackObject[]
): TrackObject[] {
	let guild = client.servers.get(guildId);
	if (!guild) throw new NoGuildFoundError();
	client.servers.set(guildId, { ...guild, queue: newQueue });
	return newQueue;
}
