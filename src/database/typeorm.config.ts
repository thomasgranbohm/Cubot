import { ConnectionOptions } from "typeorm";
import { POSTGRES } from "../constants";
import { Guild } from "./entities/Guild";

export const TOConfig = {
	type: "postgres",
	database: POSTGRES.DB,
	username: POSTGRES.USERNAME,
	password: POSTGRES.PASSWORD,
	logging: true,
	synchronize: true,
	entities: [Guild],
	cache: true
} as ConnectionOptions;