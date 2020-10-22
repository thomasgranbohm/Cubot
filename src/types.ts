import { PlayerEqualizerBand } from "@lavacord/discord.js";
import { ClientOptions, Message, User } from "discord.js";
import { MainCommand } from "./classes";
import { Categories } from "./config";

export type BotOptions = ClientOptions & {
	owner: string,
	prefix: string,
};

export interface CommandOptions {
	description: string;
	aliases?: string[];
	examples?: Array<string>;
	needsArgs?: boolean;
}

export interface MainCommandOptions extends CommandOptions {
	group: Categories;
	ownerOnly?: boolean;
	guildOnly?: boolean;
	subCommands?: Object;
}

export interface SubCommandOptions extends CommandOptions {
	parentCommand: MainCommand;
}

export type ServerObject = {
	queue: TrackObject[],
	boost: boolean,
	playing?: {
		track: TrackObject,
		message: Message
	},
	equalizer?: Equalizer,
	loop?: boolean
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