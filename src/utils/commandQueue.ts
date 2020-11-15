import { Collection, TextChannel } from 'discord.js';
import {
	BOT_MESSAGE_DELETE_TIMEOUT,
	USER_MESSAGE_DELETE_TIMEOUT,
} from '../constants';
import { CommandQueue, QueueEntry } from '../types';
import { deleteMessage, sendError, sendMessage } from '../utils';

let isHandling = false;

const messageCollection = new Collection<string, CommandQueue>();

export const getCommandQueue = (guildId: string): CommandQueue => {
	let queue = messageCollection.get(guildId);
	if (!queue) {
		queue = new Collection();
		messageCollection.set(guildId, queue);
	}
	return queue;
};

const setInCommandQueue = (
	guildId: string,
	receivedId: string,
	queueEntry: QueueEntry
) => {
	const queue = getCommandQueue(guildId);
	queue.set(receivedId, queueEntry);
	if (!!queueEntry.command && isHandling === false) {
		handleCommandQueue(guildId);
	}
};

export const addToCommandQueue = setInCommandQueue;

export const updateCommandQueue = setInCommandQueue;

export const deleteFromQueue = (guildId: string, receivedId: string) => {
	const queue = getCommandQueue(guildId);
	queue.delete(receivedId);
};

export const handleCommandQueue = async (guildId: string) => {
	while (getCommandQueue(guildId).size > 0) {
		isHandling = true;
		const [key, value] = [
			getCommandQueue(guildId).firstKey(),
			getCommandQueue(guildId).first(),
		];

		if (!key || !value) {
			console.log(key, 'Did not handle.', value);
			if (key) {
				deleteFromQueue(guildId, key);
			}
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
