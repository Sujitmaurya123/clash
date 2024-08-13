import { Job, Queue, Worker } from "bullmq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import { sendMail } from "../config/mail.js";

export const emailQueueName = "emailQueue";

interface EmailJobDateType{
    to:string;
    subject:string;
    body:string
}
export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig,
});

// * Workers
export const handler = new Worker(
  emailQueueName,
  async (job: Job) => {
    const data:EmailJobDateType = job.data;
    // console.log(data);
    await sendMail(data.to, data.subject, data.body);
  },
  { connection: redisConnection }
);