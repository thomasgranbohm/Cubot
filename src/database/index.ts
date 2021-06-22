import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { BaseTypeORMConfig, TypeORMConfig } from '../config';
import { DATABASE } from '../constants';

export async function setupDatabase(): Promise<Connection> {
	try {
		return await createConnection(TypeORMConfig as ConnectionOptions);
	} catch (err) {
		if (
			err.code === '3D000' &&
			err.message === `database "cubot" does not exist`
		) {
			// TODO this isnt optimal lmao
			const connection = await createConnection(
				BaseTypeORMConfig as ConnectionOptions
			);
			await connection.query(`CREATE DATABASE ${DATABASE.DATABASE};`);
			await connection.close();
			return setupDatabase();
		}
		throw new Error('Could not connect to database...');
	}
}
