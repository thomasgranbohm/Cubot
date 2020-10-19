import { Message, Permissions, PermissionString } from "discord.js";
import { PERMISSIONS_INTEGER } from "../constants";
import { MissingPermissionsError } from "../errors";

export default function (message: Message) {
	let { guild } = message;
	if (guild && guild.me) {
		if (!guild.me.hasPermission(PERMISSIONS_INTEGER)) {
			let { permissions } = guild.me;
			let missingPermissions = new Permissions(PERMISSIONS_INTEGER)
				.toArray()
				.filter((perm: PermissionString) => !permissions.toArray().includes(perm) ? perm : undefined);
			if (missingPermissions.length > 0)
				throw new MissingPermissionsError(missingPermissions)
		}
	}
	return true;
}