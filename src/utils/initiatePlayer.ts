import { Bot } from "../index";

export default async function (client: Bot, guildID: string) {
	if (!client.servers.get(guildID))
		client.servers.set(guildID, {
			queue: [],
			boost: false
		});
}