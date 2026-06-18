//import serverConfig from "../config/serverConfig.js";
import { Job, Worker } from "bullmq";

import SampleJob from "../jobs/SampleJob.js";

import redisConnection from "../config/redisConfig.js";

export default function SampleWorker(queueName: string){
     new Worker(
        queueName,
        async (job:Job)=> {
            console.log("It is now working for us", job);
            if(job.name === 'SampleJob'){
                const sampleJobInstance = new SampleJob(job.data);

                sampleJobInstance.handle(job);
                return true;
            }
        }, {connection: redisConnection as any}
    )
}