
import EvaluationQueue from "../queues/evaluationQueue.js";

export default async function(payload: Record<string, unknown>){
    await EvaluationQueue.add("EvaluationJob", payload);
    console.log("Added a NEW Evaluated JOB");
}