import {
	LAVALINK_PASSWORD, LAVALINK_PORT, LAVALINK_URI
} from "./constants";

export enum Categories {
	VOICE,
	UTILS,
	MISC,
	ADMIN,
	ERROR
}

export const Colors = {
	[Categories.VOICE]: "85e89d",
	[Categories.UTILS]: "f97583",
	[Categories.MISC]: "f692ce",
	[Categories.ADMIN]: "ffea7f",
	[Categories.ERROR]: "e74c3c"
};

export const LavalinkConfig = {
	host: LAVALINK_URI,
	port: LAVALINK_PORT,
	password: LAVALINK_PASSWORD,
	nodes: [
		{
			id: "1",
			host: LAVALINK_URI,
			port: LAVALINK_PORT,
			password: LAVALINK_PASSWORD
		}
	]
}
