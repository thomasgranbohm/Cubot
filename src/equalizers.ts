import { PlayerEqualizerBand } from "@lavacord/discord.js";
import { Equalizer } from "./types";

export const flat = {
	name: "flat",
	description: "Default equalizer",
	bands: new Array<PlayerEqualizerBand>(15).fill({ gain: 0, band: 0 }).map((_, i) => ({ gain: 0, band: i }))
} as Equalizer;
export const boost = {
	name: "boost",
	description: "Bass boost equalizer",
	bands: [
		{ band: 0, gain: 0.3 },
		{ band: 1, gain: 0.25 },
		{ band: 2, gain: 0.20 },
		{ band: 3, gain: 0.15 },
		{ band: 4, gain: 0.10 },
		{ band: 5, gain: 0.05 },
		{ band: 6, gain: 0.0 },
		{ band: 7, gain: -0.05 },
		{ band: 8, gain: -0.1 },
		{ band: 9, gain: -0.1 },
		{ band: 10, gain: -0.05 },
		{ band: 11, gain: 0.0 },
		{ band: 12, gain: 0.05 },
		{ band: 13, gain: 0.1 },
		{ band: 14, gain: 0.15 }
	] // TODO change with sinus function
} as Equalizer;
export const blast = {
	name: "blast",
	description: "Full on blast equalizer",
	bands: new Array<PlayerEqualizerBand>(15).fill({ gain: 0, band: 0 }).map((_, i) => ({ gain: 1.0, band: i }))
} as Equalizer;