import { ConnectionOptions, createConnection } from 'typeorm';
import { POSTGRES } from '../constants';
import { TOConfig, TOConfigNoDB } from './typeorm.config';

export async function setupDatabase(): Promise<Boolean> {
	try {
		await createConnection(TOConfig as ConnectionOptions);
	} catch (err) {
		if (err.code === '3D000' && err.message === `database "cubot" does not exist`) {
			// TODO this isnt optimal lmao
			console.log('Creating database...');
			let connection = await createConnection(TOConfigNoDB as ConnectionOptions);
			await connection.query(`CREATE DATABASE ${POSTGRES.DATABASE};`);
			await connection.close();
			return setupDatabase();
		}
		return false;
	}
	return true;
}
