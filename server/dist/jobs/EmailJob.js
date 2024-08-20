import { Queue, Worker } from "bullmq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import { sendMail } from "../config/mail.js";
export const emailQueueName = "emailQueue";
export const emailQueue = new Queue(emailQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueConfig,
});
// * Workers
export const handler = new Worker(emailQueueName, async (job) => {
    const data = job.data;
    // console.log(data);
    await sendMail(data.to, data.subject, data.html);
}, { connection: redisConnection });
