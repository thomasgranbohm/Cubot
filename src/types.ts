import { PlayerEqualizerBand } from '@lavacord/discord.js';
import { ClientOptions, Message, User } from 'discord.js';

export type BotOptions = ClientOptions & {
	owner: string;
	prefix: string;
};

export interface CommandOptions {
	description: string;
	aliases?: string[];
	examples?: Array<string>;
	needsArgs?: boolean;
}

export interface MainCommandOptions extends CommandOptions {
	category: string;
	ownerOnly?: boolean;
	guildOnly?: boolean;
	subCommands?: Object;
}

export interface SubCommandOptions extends CommandOptions {}

export type ServerObject = {
	queue: TrackObject[];
	boost: boolean;
	playing?: {
		track: TrackObject;
		message: Message;
	};
	equalizer?: Equalizer;
	loop: 'none' | 'first' | 'all';
};

export type TrackObject = {
	identifier: string;
	isSeekable: boolean;
	author: string;
	length: number;
	isStream: boolean;
	position: number;
	title: string;
	uri: string;
	track: string;
	requester: User;
	thumbnail?: string | null;
};

export type Equalizer = {
	name: String;
	description: String;
	bands: PlayerEqualizerBand[];
};

export interface HelpOptions {
	extended?: boolean;
	subName?: string;
}
