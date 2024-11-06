import { Job } from "bullmq";

import EvaluationQueueProducer from "../producers/EvaluationQueueProducer copy";
import { IJob } from "../types/bullMqJobDefinition";
import { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/ExecutorFactory";
export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;
  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    console.log("Handler of the job called");

    if (job) {
      const key = Object.keys(this.payload)[0];
      const codeLanguage = this.payload[key].language;
      const code = this.payload[key].code;
      const inputTestCase = this.payload[key].inputCase;
      const outputTestCase = this.payload[key].outputCase;
      const strategy = createExecutor(codeLanguage);
      if (strategy != null) {
        const response: ExecutionResponse = await strategy.execute(
          code,
          inputTestCase,
          outputTestCase,
        );
        EvaluationQueueProducer({
          response,
          userId: this.payload[key].userId,
          submissionId: this.payload[key].submissionId,
        });
        if (response.status === "COMPLETED") {
          console.log("Code executed successfully");
          console.log(response);
        } else {
          console.log("Something went wrong with code execution");
          console.log(response);
        }
      }
    }
  };
  failed = async (job?: Job) => {
    console.log("Job failed");
    if (job) {
      console.log(job.id);
    }
  };
}
