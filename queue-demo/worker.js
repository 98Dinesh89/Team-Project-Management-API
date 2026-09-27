import { Worker } from "bullmq";

const worker = new Worker(
    "email",
    async (job) => {
        console.log("Processing job:", job.name);
        console.log("Job data:", job.data);
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6379
        }
    }
);

console.log("Worker started");