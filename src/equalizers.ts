import { PlayerEqualizerBand } from '@lavacord/discord.js';
import { Equalizer } from './types';

export const flat = {
	name: 'flat',
	description: 'Default equalizer',
	bands: new Array<PlayerEqualizerBand>(15)
		.fill({ gain: 0, band: 0 })
		.map((_, i) => ({ gain: 0, band: i })),
} as Equalizer;
export const bass = {
	name: 'bass',
	description: 'Bass boost equalizer',
	bands: new Array<PlayerEqualizerBand>(15)
		.fill({ gain: 0, band: 0 })
		.map(
			(_, i) =>
				Math.sin(Math.PI + i * (Math.PI / 16)) * 0.4 +
				0.3
		)
		.map(
			(x, i): PlayerEqualizerBand => ({
				gain: Math.round(x * 100) / 100,
				band: i,
			})
		),
} as Equalizer;
export const blast = {
	name: 'blast',
	description: 'Full on blast equalizer',
	bands: new Array<PlayerEqualizerBand>(15)
		.fill({ gain: 0, band: 0 })
		.map((_, i) => ({ gain: 1.0, band: i })),
} as Equalizer;
