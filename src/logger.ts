export const log = (...rest: any[]) =>
	console.log('\x1b[32mCUBOT\x1b[0m', ...rest);

export const debug = (...rest: any[]) =>
	console.log('\x1b[33mDEBUG\x1b[0m', ...rest);

export const error = (...rest: any[]) =>
	console.error('\x1b[31mERROR\x1b[0m', ...rest);
