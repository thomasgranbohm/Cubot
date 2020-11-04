import { Manager } from '@lavacord/discord.js';
import { NoNodeFoundError } from '../errors';

export default function (manager: Manager): string {
	const foundNode = manager.idealNodes[0];
	if (!foundNode) throw new NoNodeFoundError();
	return foundNode.id;
}
