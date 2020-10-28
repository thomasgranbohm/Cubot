import { User } from 'discord.js';

export default function (user: User) {
	return user.avatarURL({ size: 1024 }) || user.defaultAvatarURL;
}
