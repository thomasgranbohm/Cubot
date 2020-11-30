import { Collection, Snowflake, TextChannel } from 'discord.js';
import {
	BOT_MESSAGE_DELETE_TIMEOUT,
	USER_MESSAGE_DELETE_TIMEOUT,
} from '../constants';
import { CommandQueue, QueueEntry } from '../types';
import { deleteMessage, sendError, sendMessage } from '../utils';

type GuildType = {
	queue: CommandQueue;
	isHandling: boolean;
};
// <GuildId, CommandQueue>
const guildCollection = new Collection<Snowflake, GuildType>();

export const getGuild = (guildId: string): GuildType => {
	let guild = guildCollection.get(guildId);
	if (!guild) {
		const queue: CommandQueue = new Collection();
		guild = {
			queue,
			isHandling: false,
		};
		guildCollection.set(guildId, guild);
	}
	return guild;
};

const setInCommandQueue = (
	guildId: string,
	receivedId: string,
	queueEntry: QueueEntry
) => {
	const guild = getGuild(guildId);
	const { isHandling, queue } = guild;
	queue.set(receivedId, queueEntry);
	if (!!queueEntry.command && isHandling === false) {
		handleCommandQueue(guildId);
	}
};

export const addToCommandQueue = setInCommandQueue;

export const updateCommandQueue = setInCommandQueue;

export const deleteFromQueue = (guildId: string, receivedId: string) => {
	const { queue } = getGuild(guildId);
	queue.delete(receivedId);
};

export const handleCommandQueue = async (guildId: string): Promise<any> => {
	const { queue } = getGuild(guildId);

	if (queue.size === 0) {
		guildCollection.set(guildId, { queue, isHandling: false });
		console.log(guildId, 'finished being handled');
		return;
	}

	guildCollection.set(guildId, { queue, isHandling: true });
	const [key, value] = [queue.firstKey(), queue.first()];

	if (!key || !value) {
		console.log(key, 'Did not handle.', value);
		if (key) {
			deleteFromQueue(guildId, key);
		}
		return;
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
	} catch (err) {
		sendError(err, message);
	} finally {
		deleteFromQueue(guildId, key);
		console.log(key, 'got handled. Amount left:', queue.size);
		return handleCommandQueue(guildId);
	}
};

export default guildCollection;
