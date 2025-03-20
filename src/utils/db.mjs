import knex from 'knex';
import knexConfig from './../../knexfile.cjs';

const db = knex(knexConfig);

export default db;