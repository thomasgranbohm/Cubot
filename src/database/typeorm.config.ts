import { ConnectionOptions } from "typeorm";
import { POSTGRES, PRODUCTION } from "../constants";
import { Guild } from "./entities/Guild";

export const TOConfig = {
	type: "postgres",
	database: POSTGRES.NAME,
	username: POSTGRES.USERNAME,
	password: POSTGRES.PASSWORD,
	logging: !PRODUCTION,
	synchronize: !PRODUCTION,
	entities: [Guild],
	cache: {
		type: "redis",
		duration: 30000,
		alwaysEnabled: true
	}
} as ConnectionOptions;