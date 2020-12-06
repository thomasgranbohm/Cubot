import { blue, bold, green, red, yellow } from 'chalk';
import { PRODUCTION } from './constants';

const padPrefix = (prefix: string) => prefix.padEnd(8, ' ');

export const debug = (...info: any[]) =>
	!PRODUCTION && print(blue(padPrefix('debug')), ...info);
export const warn = (...info: any[]) =>
	print(yellow(padPrefix('warn')), ...info);
export const error = (...error: any[]) =>
	print(red(padPrefix('error')), ...error);

export const log = (...info: any[]) => print(green(padPrefix('log')), ...info);

const print = (prefix: string, ...info: any[]) => {
	const parsedPrefix = bold(prefix);
	if (typeof info[0] === 'string')
		console.log(parsedPrefix + info.shift(), ...info);
	else console.log(parsedPrefix, ...info);
};
