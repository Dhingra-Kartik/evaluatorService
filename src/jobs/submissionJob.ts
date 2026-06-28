import type { IJob } from "../types/jobDefination.js";
import { Job } from "bullmq";
import type { submissionPayload } from "../types/submissionPayload.js";
import runCpp from "../containers/runCppDocker.js";

export default class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, submissionPayload>;
    constructor(payload: Record<string, submissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }
    async handle(job?: Job): Promise<void> {
        console.log("This is our payload we sent", this.payload);
        if(job){
        console.log(`✅ Handling job: ${this.name}`);
        const key= Object.keys(this.payload)[0] as keyof typeof this.payload;
        const submission = this.payload[key];
        if(submission){
        console.log(submission.language);
        if(submission.language === "CPP"){
            const response = await runCpp(submission.code, submission.inputCase);
            console.log("Evaluated response is: ", response);
        }
    }
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