import type { IJob } from "../types/jobDefination.js";
import { Job } from "bullmq";
import type { submissionPayload } from "../types/submissionPayload.js";
import createExecutor from "../utils/ExecutorFactory.js";
import type { ExecutionResponse } from "../containers/codeExecutorStrategy.js";
import evalutionQueueProducer from "../producers/evalutionQueueProducer.js";

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
        const codeLanguage: any = this.payload[key]?.language;
        const code: any = this.payload[key]?.code;
        const inputTestCase: any = this.payload[key]?.inputCase;
        const outputTestCase: any = this.payload[key]?.outputCase;
        const userId: any = this.payload[key]?.userId
        const submissionId: any = this.payload[key]?.submissionId

        const strategy = createExecutor(codeLanguage);
        if(strategy!== null){
            const response: ExecutionResponse = await strategy.execute(code, inputTestCase, outputTestCase);
            evalutionQueueProducer({response, userId, submissionId});
            if(response.status === "SUCCESS"){
                console.log("Code executed successfully, job status SUCCESS");
                console.log({Output: response.output, Status: response.status});
            } else {
                console.log("Job Error: Something went wrong with execution of code");
                console.log(response);
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