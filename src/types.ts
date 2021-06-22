import { PlayerEqualizerBand } from '@lavacord/discord.js';
import {
	ClientOptions,
	Collection,
	Message,
	MessageEmbed,
	NewsChannel,
	TextChannel,
	User,
} from 'discord.js';
import { Command, CustomEmbed } from './classes';
import { Categories } from './config';

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
	category: Categories;
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

export type CommandQueue = Collection<string, QueueEntry>;

export type QueueEntry = {
	channel: TextChannel | NewsChannel;
	command: Command;
	options: {
		message: Message;
		args: string[];
		category: Categories;
	};
};

export type OutgoingMessage = string | MessageEmbed | CustomEmbed | undefined;

export type CustomEmbedOptions = {
	scroll?: boolean;
	amount?: number;
};

export type PermissionArrayType = {
	[key: string]: {
		name: string;
		description: string;
		type?: 'critical' | 'not in use';
	};
};
