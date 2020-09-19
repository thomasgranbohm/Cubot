import { Command } from "./classes";
import { UPPER_VOLUME_LIMIT } from "./constants";

export class ArgumentError extends Error {
	name: string = "ArgumentError";
	message: string;

	constructor(command: Command, prefix: string) {
		super()
		this.message = "You didn't provide the needed arguments.\n" +
			`Here is how you use it: \`${command.usage(prefix)}\``
	}
}

export class OwnerError extends Error {
	name: string = "Owner";
	message: string = "Only the owner of this bot can use this command.";
}

export class PermissionError extends Error {
	name: string = "Permission";
	message: string = "This command can only be used in a guild.";
}

export class UserNotInChannelError extends Error {
	name: string = "Voice";
	message: string = "You are not in a voice channel.";
}

export class NoResultsFoundError extends Error {
	name: string = "Result";
	message: string = "No results found. Please try again!";
}

export class NoNodeFoundError extends Error {
	name: string = "NoNodeFound";
	message: string = "No audio node found. Please contact the owner!";
}

export class NotPlayingError extends Error {
	name: string = "NoTrackPlaying";
	message: string = "I'm not playing anything.";
}

export class NoGuildFoundError extends Error {
	name: string = "NoGuildFound";
	message: string = "No guild found.";
}
export class BotNotInVoiceError extends Error {
	name: string = "BotNotInVoice";
	message: string = "I'm not in a voice channel.";
}
export class BotInAnotherVoiceError extends Error {
	name: string = "BotInAnotherVoice";
	message: string = "I'm already in another voice channel.";
}

export class VolumeNotBetweenThresholdError extends Error {
	name: string = "VolumeNotBetweenThreshold";
	message: string = `Volume needs to be between 0 and ${UPPER_VOLUME_LIMIT}.`;
}

export class MissingPermissionsError extends Error {
	name: string = "MissingPermissions";
	message: string = `Please give me the the missing permissions.`;
}

export class NoEqualizerFoundError extends Error {
	name: string = "NoEqualizerFound";
	message: string = "That equalizer doesn't exist.";
}

export class UnexpectedError extends Error {
	name: string = "Oops, an actual error...";
	message: string = "Sorry about that. Please try again!\n" +
		"Reoccurring issue? [Please report it!](https://github.com/thomasgranbohm/CuBot/issues)";
	developerMessage: string;
	constructor(developerMessage: string) {
		super();
		this.developerMessage = developerMessage;
	}
}