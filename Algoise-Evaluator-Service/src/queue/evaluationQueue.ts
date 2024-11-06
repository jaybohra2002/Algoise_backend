import { Queue } from "bullmq";

import redisConnection from "../config/redisConfig";
import evaluationQueue from "../queue/evaluationQueue";

export default new Queue(evaluationQueue, { connection: redisConnection });
