import { Collection, Snowflake, TextChannel } from 'discord.js';
import {
	BOT_MESSAGE_DELETE_TIMEOUT,
	USER_MESSAGE_DELETE_TIMEOUT,
} from '../constants';
import * as logger from '../logger';
import { CommandQueue, QueueEntry } from '../types';
import { deleteMessage, sendError, sendMessage } from '../utils';

type GuildType = {
	queue: CommandQueue;
	isHandling: boolean;
};
// <GuildId, CommandQueue>
const messageCollection = new Collection<Snowflake, GuildType>();

export const getGuild = (guildId: string): GuildType => {
	let guild = messageCollection.get(guildId);
	if (!guild) {
		const queue: CommandQueue = new Collection();
		guild = {
			queue,
			isHandling: false,
		};
		messageCollection.set(guildId, guild);
	}
	return guild;
};

const setInMessageCollection = (guildId: string, newSetting: GuildType) => {
	messageCollection.set(guildId, newSetting);
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

export const handleCommandQueue = async (guildId: string) => {
	const { queue } = getGuild(guildId);
	while (queue.size > 0) {
		setInMessageCollection(guildId, { queue, isHandling: true });
		const [key, value] = [queue.firstKey(), queue.first()];

		if (!key || !value) {
			logger.log(key, 'Did not handle.', value);
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
		} catch (err) {
			sendError(err, message);
		} finally {
			deleteFromQueue(guildId, key);
		}
	}
	setInMessageCollection(guildId, { queue, isHandling: false });
};

export default messageCollection;
