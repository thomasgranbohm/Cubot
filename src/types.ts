import { ClientOptions, User, Message } from "discord.js";

export type BotOptions = ClientOptions & {
	owner: string,
	prefix: string,
};

export type CommandOptions = {
	description: string,
	group: string,
	aliases?: string[],
	examples?: Array<string>,
	ownerOnly?: boolean,
	guildOnly?: boolean,
	needsArgs?: boolean,
}

export type ServerObject = {
	queue: TrackObject[],
	boost: boolean,
	playing?: {
		track: TrackObject,
		message: Message
	},
}

export type TrackObject = {
	identifier: string,
	isSeekable: boolean,
	author: string,
	length: number,
	isStream: boolean,
	position: number,
	title: string,
	uri: string,
	track: string,
	requester: User,
	thumbnail?: string | null
}

export const Categories = {
	VOICE: "85e89d",
	UTILS: "f97583",
	MISC: "f692ce",
	ADMIN: "ffea7f",
};

export const LavalinkConfig = {
	host: "192.168.1.147",
	port: 2333,
	password: "youshallnotpass",
	nodes: [
		{
			id: "1",
			host: "192.168.1.147",
			port: 2333,
			password: "youshallnotpass"
		}
	]
}