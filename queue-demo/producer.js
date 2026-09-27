import { Queue } from "bullmq";

const emailQueue = new Queue("email", {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});

await emailQueue.add("welcome-email", {
    email: "test@example.com",
    name: "Dinesh"
});

console.log("Job added");