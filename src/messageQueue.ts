import { Collection } from 'discord.js';
import { MessageQueue, QueueEntry } from './types';
import { sendMessage } from './utils';

const messageCollection = new Collection<string, MessageQueue>();

export function getMessageQueue(guildId: string): MessageQueue {
	let queue = messageCollection.get(guildId);
	if (!queue) {
		queue = new Collection();
		messageCollection.set(guildId, queue);
	}
	return queue;
}

export const addToMessageQueue = setInMessageQueue;

export const updateMessageQueue = setInMessageQueue;

function setInMessageQueue(
	guildId: string,
	receivedId: string,
	queueEntry: QueueEntry
) {
	const queue = getMessageQueue(guildId);
	queue.set(receivedId, queueEntry);
	if (!!queueEntry.pendingMessage) {
		handleMessageQueue(guildId);
	}
}

export function deleteFromQueue(guildId: string, receivedId: string) {
	const queue = getMessageQueue(guildId);
	queue.delete(receivedId);
}

export const handleMessageQueue = async (guildId: string) => {
	while (getMessageQueue(guildId).size > 0) {
		const [key, value] = [
			getMessageQueue(guildId).firstKey(),
			getMessageQueue(guildId).first(),
		];
		if (!key || !value || !value.pendingMessage) {
			console.log(key, 'Did not handle.');
			break;
		}
		await sendMessage(value);
		deleteFromQueue(guildId, key);
	}
};

export default messageCollection;
