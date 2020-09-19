import { ConnectionOptions, createConnection } from "typeorm";
import { TOConfig } from "./typeorm.config";

export async function setupDatabase(): Promise<Boolean> {
	await createConnection(TOConfig as ConnectionOptions);
	return true;
}