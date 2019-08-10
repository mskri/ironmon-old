import * as dotenv from 'dotenv-safe';
import * as path from 'path';

dotenv.config({
    path: path.join(__dirname, '../../../.env'),
    sample: path.join(__dirname, './../../../.env.example'),
    allowEmptyValues: true
});

export const AUTH_TOKEN = process.env.AUTH_TOKEN;
export const ENV = process.env.NODE_ENV;
export const DB_SSL = process.env.DB_SSL ? process.env.DB_SSL : null;
export const OWNER_ID = process.env.OWNER_ID ? process.env.OWNER_ID : null;

export default {
    AUTH_TOKEN,
    ENV,
    OWNER_ID,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: null
    }
};
