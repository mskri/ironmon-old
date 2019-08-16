import * as dotenv from 'dotenv-safe';
import * as path from 'path';

dotenv.config({
    path: path.join(__dirname, '../../.env'),
    sample: path.join(__dirname, '../../.env.example'),
    allowEmptyValues: true
});

export const AUTH_TOKEN = process.env.AUTH_TOKEN;
export const GRAPHQL_URL = process.env.GRAPHQL_URL;
export const OWNER_ID = process.env.OWNER_ID || null;
