import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL


if(!connectionString){
    throw new Error('DATABASE_URL is not defined in environment variables')
}
const sql = postgres(connectionString, {
    ssl: true,
});


export default sql
