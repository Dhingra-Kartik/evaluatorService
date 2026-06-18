import SampleQueue from "../queues/SampleQueue.js";

export default async function(name: string, payload: Record<string, unknown> ){
    await SampleQueue.add(name, payload);
    console.log("ADDED A NEW JOB");
}