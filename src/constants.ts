import { config } from "dotenv";
import * as fs from "fs";
import { resolve } from "path";
import YAML from "yaml";
config({ path: resolve(process.cwd(), '.env') })

const file = fs.readFileSync(resolve(process.cwd(), 'application.yml'), 'utf8');
const parsed = YAML.parse(file);
const { port, address } = parsed.server;
const { password } = parsed.lavalink.server

export const PREFIX = "!";
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "INSERT YOUR TOKEN IN THE .env FILE";
export const OWNER = "284754083049504770";
export const PRODUCTION = (process.env.NODE_ENV || "development") === "production";

export const POSTGRES = {
	USERNAME: process.env.POSTGRES_USERNAME || "postgres",
	PASSWORD: process.env.POSTGRES_PASSWORD || "postgres"
}
export const LAVALINK_URI = address as string;
export const LAVALINK_PORT = port as number;
export const LAVALINK_PASSWORD = password as string;

export const PERMISSIONS_INTEGER = 305659632;
export const UPPER_VOLUME_LIMIT = 300;
export const PLAYLIST_AMOUNT = 15;
