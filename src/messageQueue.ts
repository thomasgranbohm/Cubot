import { Collection, MessageEmbed } from 'discord.js';
import { IdMessageCollection } from './types';

const messageCollection = new Collection<string, IdMessageCollection>();

export function getMessageQueue(guildId: string): IdMessageCollection {
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
	returningMessage?: string | MessageEmbed
) {
	console.log(receivedId, 'Set as', returningMessage);
	const queue = getMessageQueue(guildId);
	queue.set(receivedId, returningMessage);
	if (!!returningMessage) {
		handleMessageQueue(guildId);
	}
}

export function deleteFromQueue(guildId: string, receivedId: string) {
	const queue = getMessageQueue(guildId);
	queue.delete(receivedId);
}

export function handleMessageQueue(guildId: string) {
	while (getMessageQueue(guildId).size > 0) {
		const [key, value] = [
			getMessageQueue(guildId).firstKey(),
			getMessageQueue(guildId).first(),
		];
		if (!key || !value) {
			console.log('Did not handle', key, value);
			break;
		}
		console.log(key, 'Handled:', value);
		deleteFromQueue(guildId, key);
	}
}

export default messageCollection;

// const main = async () => {
// 	const guildId = '12345';
// 	const first = '00001';
// 	const second = '00000';
// 	const returningMessage = 'Test';

// 	addToMessageQueue(guildId, first);
// 	addToMessageQueue(guildId, second, returningMessage + second);

// 	setTimeout(
// 		() => updateMessageQueue(guildId, first, returningMessage + first),
// 		1000
// 	);
// };

// main();
