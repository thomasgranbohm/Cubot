import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), '.env') })

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "INSERT YOUR TOKEN IN THE .env FILE";
export const PREFIX = "?";
export const OWNER = "284754083049504770";
export const UPPER_VOLUME_LIMIT = 300;
export const PERMISSIONS_INTEGER = 305659632;