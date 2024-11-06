import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import evaluationQueue from "../queue/evaluationQueue";
import sampleQueue from "../queue/sampleQueue";
import submissionQueue from "../queue/submissionQueue";
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/ui");

createBullBoard({
  queues: [
    new BullMQAdapter(sampleQueue),
    new BullMQAdapter(submissionQueue),
    new BullMQAdapter(evaluationQueue),
  ],
  serverAdapter,
});

export default serverAdapter;
