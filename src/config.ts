import { 
	LAVALINK_URI, 
	LAVALINK_PORT,
	LAVALINK_PASSWORD
} from "./constants";

export const Categories = {
	VOICE: "85e89d",
	UTILS: "f97583",
	MISC: "f692ce",
	ADMIN: "ffea7f",
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
