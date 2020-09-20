import { POSTGRES, PRODUCTION } from "../constants";
import { Guild } from "./entities/Guild";

export const TOConfig = {
	type: "postgres",
	database: "cubot",
	username: POSTGRES.USERNAME,
	password: POSTGRES.PASSWORD,
	logging: !PRODUCTION,
	synchronize: true,
	entities: [Guild],
	cache: {
		type: "redis",
		duration: 30000,
		alwaysEnabled: true
	}
};

export const TOConfigNoDB = {
	type: "postgres",
	username: POSTGRES.USERNAME,
	password: POSTGRES.PASSWORD,
	logging: !PRODUCTION,
	synchronize: true,
};