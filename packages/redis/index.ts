import Redis from 'ioredis'
import dotenv from 'dotenv';
dotenv.config();


const redis = new Redis(process.env.REDIS_DATABASE_URI!);

export default redis;
