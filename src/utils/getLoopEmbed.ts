import { MessageEmbed } from "discord.js";

export default function (loop: string): MessageEmbed {
	const embed = new MessageEmbed();

	switch (loop) {
		case "none":
			embed.setTitle("No repeats :arrow_forward:")
			break;
		case "first":
			embed.setTitle("Repeating first :repeat_one:")
			break;
		case "all":
			embed.setTitle("On repeat :repeat:")
			break;
	}
	return embed;
}