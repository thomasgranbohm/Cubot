import { Message } from 'discord.js';
import {
	MESSAGE_DELETION_TIMEOUT_BOT,
	MESSAGE_DELETION_TIMEOUT_USER,
} from '../constants';
import { error } from '../logger';
import { MessageReturnType } from '../types';

namespace Messaging {
	export const send = async (
		message: Message,
		payload: MessageReturnType
	) => {
		if (!payload) return;
		const sent_message = await message.channel.send(payload);

		Messaging.remove(sent_message, true);
	};

	export const remove = async (message: Message, self = false) => {
		setTimeout(
			() => message.delete().catch(error),
			self ? MESSAGE_DELETION_TIMEOUT_BOT : MESSAGE_DELETION_TIMEOUT_USER
		);
	};
}

export default Messaging;
