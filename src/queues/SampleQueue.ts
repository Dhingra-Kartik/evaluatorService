import { Queue } from "bullmq";
import redisConnection from "../config/redisConfig.js";

export default new Queue('SampleQueue', {connection: redisConnection as any});

// import serverConfig from "../config/serverConfig.js";
// export default new Queue('SampleQueue', {connection: {
//             host: serverConfig.REDIS_HOST,
//             port: serverConfig.REDIS_PORT,
//         }});
