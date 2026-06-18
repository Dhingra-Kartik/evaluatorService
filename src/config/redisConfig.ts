import {Redis} from "ioredis";
import serverConfig from "./serverConfig.js";

const redisConnection = new Redis({
    host: serverConfig.REDIS_HOST, 
    port: serverConfig.REDIS_PORT,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
});
// const redisConnection = new Redis(redisConfig);
export default redisConnection;


// import { Redis } from 'ioredis';
// import type { RedisOptions } from "ioredis";
// import serverConfig from './serverConfig.js'

// const redisConfig: RedisOptions = {
//     host: serverConfig.REDIS_HOST, 
//     port: serverConfig.REDIS_PORT,
//     maxRetriesPerRequest: null,
// }

// const redisConnection = new Redis(redisConfig);
// export default redisConnection;