import { Job } from "bullmq";

export interface IJob {
    name:string,
    payload?: Record<string, unknown>
    handle: (job?: Job) => Promise<void> | void;
    failed: (job?: Job) => Promise<void> | void;
}

