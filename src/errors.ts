import { Command } from "./classes/command";

export class ArgumentError extends Error {
	name: string = "ArgumentError";
	message: string;

	constructor(command: Command) {
		super()
		this.message = "You didn't provide the needed arguments.\n" +
			`Here is how you use it: \`${command.usage()}\``
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

export class ResultError extends Error {
	name: string = "Result";
	message: string = "No result found. Please try again!";
}

export class NoNodeFoundError extends Error {
	name: string = "NoNodeFound";
	message: string = "No audio node found. Please contact the owner!";
}

export class NoTrackPlayingError extends Error {
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