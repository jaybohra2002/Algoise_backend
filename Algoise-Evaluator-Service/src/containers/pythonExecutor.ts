import CodeExecutorStrategy, {
  ExecutionResponse,
} from "../types/CodeExecutorStrategy"; // Ensure this is correct
import { PYTHON_IMG } from "../utils/constants";
import createContainer from "./dockerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

class PythonExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponse> {
    // Correct signature
    console.log(outputTestCase);
    const rawLogBuffer: Buffer[] = [];
    console.log("Initialising a new Python docker container");
    await pullImage(PYTHON_IMG);

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    console.log(runCommand);

    const pythonDockerContainer = await createContainer(PYTHON_IMG, [
      "/bin/sh",
      "-c",
      runCommand,
    ]);

    await pythonDockerContainer.start();
    console.log("Started the docker container");

    const loggerStream = await pythonDockerContainer.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: true,
    });

    loggerStream.on("data", (chunk) => {
      rawLogBuffer.push(chunk);
    });

    try {
      const codeResponse: string = await this.fetchDecodedStream(
        loggerStream,
        rawLogBuffer,
      );
      return { output: codeResponse, status: "COMPLETED" };
    } catch (error) {
      return { output: error as string, status: "ERROR" };
    } finally {
      await pythonDockerContainer.remove();
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

export default PythonExecutor;
