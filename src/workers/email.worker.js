import { Worker } from "bullmq";
import { sendReminderEmail, sendVerificationEmail } from "../services/email.service.js";

const worker = new Worker(
    "email",
    async (job) => {
        console.log("JOB RECEIVED");
        console.log("name:", job.name);
        console.log("data:", job.data);

        if (job.name === "verification-email") {
            await sendVerificationEmail(
                job.data.email,
                job.data.name,
                job.data.verificationToken
            );
        } else if (job.name === "reminder-email") {
            console.log("ENTERED REMINDER BRANCH");

            await sendReminderEmail(
                job.data.email,
                job.data.name
            );
        } else {
            console.log("UNKNOWN JOB:", job.name);
        }
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6379
        }
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error.message);
});

console.log("Email worker started");