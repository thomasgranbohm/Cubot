import {
	entersState,
	getVoiceConnection,
	joinVoiceChannel,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { StageChannel, VoiceChannel } from 'discord.js';
import {
	BotInVoiceChannelError,
	StageSupportError,
	UserNotInVoiceChannelError,
} from '../errors';

namespace Voice {
	export const create = async (channel: VoiceChannel | StageChannel) => {
		const existing_connection = get(channel);
		if (!!existing_connection) throw BotInVoiceChannelError;

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});

		return entersState(connection, VoiceConnectionStatus.Ready, 15e3);
	};

	export const get = (channel: VoiceChannel | StageChannel) => {
		if (!channel) throw UserNotInVoiceChannelError;
		if (channel instanceof StageChannel) throw StageSupportError;

		const existing_connection = getVoiceConnection(channel.guild.id);

		return existing_connection;
	};
}

export default Voice;
