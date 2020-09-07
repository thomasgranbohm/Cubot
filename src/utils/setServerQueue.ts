import { Bot } from "src";
import { TrackObject } from "../types";
import { NoGuildFoundError } from "../errors";

export default function (client: Bot, guildId: string, newQueue: TrackObject[]): TrackObject[] {
	let guild = client.servers.get(guildId);
	if (!guild) throw new NoGuildFoundError()
	client.servers.set(guildId, { ...guild, queue: newQueue })
	return newQueue;
}