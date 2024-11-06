import CodeExecutorStrategy, {
  ExecutionResponse,
} from "../types/CodeExecutorStrategy";
import { JAVA_IMG } from "../utils/constants";
import createContainer from "./dockerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

class JavaExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponse> {
    console.log("Java Executor Called");
    console.log(outputTestCase);
    const rawLogBuffer: Buffer[] = [];
    console.log("Initialising a new Java docker container");
    await pullImage(JAVA_IMG);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
    console.log(runCommand);

    const javaDockerContainer = await createContainer(JAVA_IMG, [
      "/bin/sh",
      "-c",
      runCommand,
    ]);

    // Start the corresponding docker container
    await javaDockerContainer.start();
    console.log("Started the docker container");

    const loggerStream = await javaDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true, // whether the logs are streamed or returned as a string
    });

    // Attach events on the stream objects to start and stop reading
    loggerStream.on("data", (chunk) => {
      rawLogBuffer.push(chunk);
    });

    try {
      const codeResponse: string = await this.fetchDecodedStream(
        loggerStream,
        rawLogBuffer,
      );
      if (codeResponse.trim() === outputTestCase.trim()) {
        return { output: codeResponse, status: "SUCCESS" };
      } else {
        return { output: codeResponse, status: "WA" };
      }
    } catch (error) {
      throw error;
    } finally {
      await javaDockerContainer.remove();
    }
  }

  fetchDecodedStream(
    loggerStream: NodeJS.ReadableStream,
    rawLogBuffer: Buffer[],
  ): Promise<string> {
    // TODO: May be moved to the docker helper util'

    return new Promise((res, rej) => {
      const timeout = setTimeout(() => {
        console.log("Timeout called");
        rej("TLE");
      }, 2000);
      loggerStream.on("end", () => {
        // This callback executes when the stream ends
        clearTimeout(timeout);
        console.log(rawLogBuffer);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        // console.log(decodedStream);
        // console.log(decodedStream.stdout);
        if (decodedStream.stderr) {
          rej(decodedStream.stderr);
        } else {
          res(decodedStream.stdout);
        }
      });
    });
  }
}

export default JavaExecutor;
