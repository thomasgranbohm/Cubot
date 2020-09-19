import { Guild } from "discord.js";
import { Message } from "discord.js";
import { UnexpectedError } from "../errors";

export default function (message: Message): Guild {
	let { guild } = message;
	if (!guild) throw new UnexpectedError("Message didnt have guild");
	return guild;
}