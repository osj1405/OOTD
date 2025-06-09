import postgres from "postgres";
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.DATABASE_URL

if(!connectionString){
    console.log('connection failed')
    throw new Error('DATABASE_URL이 없다.')
}
const sql = postgres(connectionString, {
    ssl: 'require'
})

console.log("2")
export default sql