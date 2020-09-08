import { ClientOptions, User, Message } from "discord.js";
import { PlayerEqualizerBand } from "@lavacord/discord.js";

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
	equalizer?: Equalizer
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

export type Equalizer = {
	name: String,
	description: String,
	bands: PlayerEqualizerBand[];
}