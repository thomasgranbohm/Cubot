import { Guild, Permissions, PermissionString } from "discord.js";
import { PERMISSIONS_INTEGER } from "../constants";
import { MissingPermissionsError } from "../errors";

/**
 * @param guild Guild in which the message was sent
 * @throws MissingPermissionsError if permissions are missing
 */

export default function (guild: Guild) {
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