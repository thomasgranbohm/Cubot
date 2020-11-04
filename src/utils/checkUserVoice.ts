import { Message } from 'discord.js';
import {
	BotInAnotherVoiceError,
	UserNotInChannelError,
} from '../errors';

export default function (message: Message): string {
	if (!message.member?.voice.channelID) {
		throw new UserNotInChannelError();
	}

	if (
		message.guild?.me?.voice &&
		message.guild.me.voice.channelID &&
		message.member.voice.channelID !==
			message.guild.me.voice.channelID
	)
		throw new BotInAnotherVoiceError();
	return message.member.voice.channelID;
}
