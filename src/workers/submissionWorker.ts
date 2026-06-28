//import serverConfig from "../config/serverConfig.js";
import { Job, Worker } from "bullmq";

import SubmissionJob from "../jobs/submissionJob.js";

import redisConnection from "../config/redisConfig.js";

export default function SubmissionWorker(queueName: string){
     new Worker(
        queueName,
        async (job:Job)=> {
            console.log("It is now working for us", job);
            if(job.name === 'SubmissionJob'){
                const submissionJobInstance = new SubmissionJob(job.data);

                submissionJobInstance.handle(job);
                return true;
            }
        }, {connection: redisConnection as any}
    )
}