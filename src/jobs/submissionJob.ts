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

  if (job) {
    console.log(`✅ Handling job: ${this.name}`);

    const [key, submission] = Object.entries(this.payload)[0] as [string, submissionPayload];
    const { code, language, testCases, userId, submissionId } = submission;
    console.log(key.toString());

    const strategy = createExecutor(language);
    if (strategy !== null) {
      const tasks = testCases.map(tc =>
        strategy.execute(code, tc.input, tc.output)
      );

const results: ExecutionResponse[] = await Promise.all(tasks);

results.forEach((response, idx) => {
        const tc = testCases[idx];
        if(!tc) return;
        if (response.status === "SUCCESS") {
          console.log("✅ Test case passed", {
            Input: tc.input,
            Expected: tc.output,
            Output: response.output,
          });
        } else {
          console.log("❌ Test case failed", {
            Input: tc.input,
            Expected: tc.output,
            Output: response.output,
          });
        }
      });

      // Send aggregated results back
      evalutionQueueProducer({ response: results, userId, submissionId });
    } else {
      console.log("Job Error: No executor strategy found");
    }
  }
}

    async failed(job?: Job): Promise<void> {
        if(job){
        console.error(`❌ Job failed: ${this.name}`);
        console.error("Job ID:", job?.id);
        }
    }
}