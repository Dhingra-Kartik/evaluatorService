import type { IJob } from "../types/jobDefination.js";
import { Job } from "bullmq";

export default class SampleJob implements IJob {
    name: string;
    payload: Record<string, unknown>;
    constructor(payload: Record<string, unknown>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }
    async handle(job?: Job): Promise<void> {
        console.log("This is our payload we sent", this.payload);
        if(job){
        console.log(`✅ Handling job: ${this.name}`);
        console.log("BullMQ job data:", job?.data);
        }
    }

    async failed(job?: Job): Promise<void> {
        if(job){
        console.error(`❌ Job failed: ${this.name}`);
        console.error("Job ID:", job?.id);
        }
    }
}