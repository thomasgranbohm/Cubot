import { Guild, Permissions, PermissionString } from 'discord.js';
import { PERMISSIONS_INTEGER, PERMISSION_DETAILS } from '../constants';
import { MissingPermissionsError } from '../errors';

/**
 * @param guild Guild in which the message was sent
 * @throws MissingPermissionsError if permissions are missing
 */

export const hasSpecificPermission = (
	guild: Guild,
	permission: PermissionString
) => {
	if (guild && guild.me) {
		let { permissions } = guild.me;
		let missingPermissions = new Permissions(PERMISSIONS_INTEGER)
			.toArray()
			.filter((perm: PermissionString) =>
				!permissions.toArray().includes(perm) &&
				PERMISSION_DETAILS[perm].type === 'critical'
					? perm
					: undefined
			);
		return missingPermissions.includes(permission);
	}
	return false;
};

export const hasEveryPermission = (guild: Guild) => {
	if (guild && guild.me) {
		if (!guild.me.hasPermission(PERMISSIONS_INTEGER)) {
			let { permissions } = guild.me;
			let missingPermissions = new Permissions(PERMISSIONS_INTEGER)
				.toArray()
				.filter((perm: PermissionString) =>
					!permissions.toArray().includes(perm) &&
					PERMISSION_DETAILS[perm].type === 'critical'
						? perm
						: undefined
				);
			if (missingPermissions.length > 0)
				throw new MissingPermissionsError(missingPermissions);
		}
	}
	return true;
};
