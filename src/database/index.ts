import { createConnection } from "typeorm";
import { TOConfig } from "./typeorm.config";

export async function setupDatabase(): Promise<Boolean> {
	await createConnection(TOConfig);
	return true;
}