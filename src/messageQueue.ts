import { Collection, TextChannel } from 'discord.js';
import { BOT_MESSAGE_DELETE_TIMEOUT, USER_MESSAGE_DELETE_TIMEOUT } from './constants';
import { MessageQueue, QueueEntry } from './types';
import { deleteMessage, sendError, sendMessage } from './utils';

let isHandling = false;

const messageCollection = new Collection<string, MessageQueue>();

export const getMessageQueue = (guildId: string): MessageQueue => {
	let queue = messageCollection.get(guildId);
	if (!queue) {
		queue = new Collection();
		messageCollection.set(guildId, queue);
	}
	return queue;
};

const setInMessageQueue = (
	guildId: string,
	receivedId: string,
	queueEntry: QueueEntry
) => {
	try {
		const queue = getMessageQueue(guildId);
		queue.set(receivedId, queueEntry);
		if (!!queueEntry.command && isHandling === false) {
			handleMessageQueue(guildId);
		}
	} catch (error) {
		console.error('wtf got error', error);
	}
};

export const addToMessageQueue = setInMessageQueue;

export const updateMessageQueue = setInMessageQueue;

export const deleteFromQueue = (guildId: string, receivedId: string) => {
	const queue = getMessageQueue(guildId);
	queue.delete(receivedId);
};

export const handleMessageQueue = async (guildId: string) => {
	while (getMessageQueue(guildId).size > 0) {
		isHandling = true;
		const [key, value] = [
			getMessageQueue(guildId).firstKey(),
			getMessageQueue(guildId).first(),
		];

		if (
			!key ||
			!value ||
			!value.command ||
			!value.channel ||
			!value.options
		) {
			console.log(key, 'Did not handle.', value);
			break;
		}
		const {
			channel,
			command,
			options: { args, category, message },
		} = value;

		try {
			const outgoingMessage = await command.run(message, args);
			const sentMessage = await sendMessage(
				channel,
				outgoingMessage,
				category
			);

			deleteMessage(sentMessage, BOT_MESSAGE_DELETE_TIMEOUT);
			if (channel instanceof TextChannel !== false) {
				deleteMessage(message, USER_MESSAGE_DELETE_TIMEOUT);
			}
			deleteFromQueue(guildId, key);
		} catch (err) {
			sendError(err, message);
		}
	}
	isHandling = false;
};

export default messageCollection;
