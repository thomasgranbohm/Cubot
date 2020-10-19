import { MessageEmbed, PermissionString } from "discord.js";
import { Command } from "./classes";
import { UPPER_VOLUME_LIMIT } from "./constants";

export class CustomError extends Error {
	name: string;
	message: string;
	embed?: MessageEmbed;
	developerMessage?: string;
	shouldBeDeleted?: boolean = true;
}

export class ArgumentError extends CustomError {
	message: string;

	constructor(command: Command, prefix: string) {
		super()
		this.message = "You didn't provide the needed arguments.\n" +
			`Here is how you use it: \`${command.usage(prefix)}\``
	}
}

export class OwnerError extends CustomError {
	message: string = "Only the owner of this bot can use this command.";
}

export class GuildOnlyError extends CustomError {
	message: string = "This command can only be used in a guild.";
}

export class UserNotInChannelError extends CustomError {
	message: string = "You are not in a voice channel.";
}

export class NoResultsFoundError extends CustomError {
	message: string = "No results found. Please try again!";
}

export class NoNodeFoundError extends CustomError {
	message: string = "No audio node found. Please contact the owner!";
}

export class NotPlayingError extends CustomError {
	message: string = "I'm not playing anything.";
}

export class NoGuildFoundError extends CustomError {
	message: string = "No guild found.";
}
export class BotNotInVoiceError extends CustomError {
	message: string = "I'm not in a voice channel.";
}
export class BotInAnotherVoiceError extends CustomError {
	message: string = "I'm already in another voice channel.";
}

export class VolumeNotBetweenThresholdError extends CustomError {
	message: string = `Volume needs to be between 0 and ${UPPER_VOLUME_LIMIT}.`;
}

export class MissingPermissionsError extends CustomError {
	message: string = "Please give me these missing permissions";
	shouldBeDeleted = false;

	constructor(missingPermissions: Array<PermissionString>) {
		super();
		this.embed = new MessageEmbed()
			.setDescription(
				missingPermissions
					.sort((a: string, b: string) => a.localeCompare(b))
					.map(perm => {
						// ssssssh don't look at this part
						// its ugly but it works
						return ` – ${perm.split("_").join(" ")}`;
					})
			);
	}
}

export class NoEqualizerFoundError extends CustomError {
	message: string = "That equalizer doesn't exist.";
}

export class UnexpectedError extends CustomError {
	name: string = "Oops, an actual error...";
	message: string = "Sorry about that. Please try again!\n" +
		"Reoccurring issue? [Please report it!](https://github.com/thomasgranbohm/CuBot/issues)";
	developerMessage: string;
	constructor(developerMessage: string) {
		super();
		this.developerMessage = developerMessage;
	}
}