
import createContainer from './containerFactory.js';
import { PYTHON_IMAGE } from '../utils/constants.js';
import decodeDockerStream from './dockerHelper.js';
import pullimage from './pullImage.js';
import type CodeExecutorStrategy from './codeExecutorStrategy.js';
import type { ExecutionResponse } from './codeExecutorStrategy.js';

class PythonExecutor implements CodeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputTestCase :string): Promise<ExecutionResponse> {
        console.log(code, inputTestCase, outputTestCase);
         console.log("Python executor called");
        const rawbuffer: Buffer[] = [];
        await pullimage(PYTHON_IMAGE);
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo ${inputTestCase.replace(/'/g, `'\\"`)} | python3 test.py`;

        const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
            '/bin/sh',
            '-c',
            runCommand
        ]);

        await pythonDockerContainer.start();
        console.log("STARTED DOCKER CONTAINER");

        const loggerStream = await pythonDockerContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: true,
            follow: true
        });

        loggerStream.on('data', (chunk) => {
            rawbuffer.push(chunk);
        });


        try {
            const codeResponse: string = await this.fetchDecodedStream(loggerStream, rawbuffer);
            return { output: codeResponse, status: "COMPLETED" };
        } catch (err) {
            return { output: err as string, status: "ERROR" }

        } finally {
            await pythonDockerContainer.remove();

        }

    }

    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawbuffer: Buffer[]): Promise<string> {
        return new Promise((res, rej) => {
            loggerStream.on('end', () => {
                console.log(rawbuffer);
                const completedBuffer = Buffer.concat(rawbuffer);
                const decodedStream = decodeDockerStream(completedBuffer);
                console.log(decodedStream);
                if (decodedStream.stderr) {
                    rej(decodedStream.stderr);
                } else {
                    res(decodedStream.stdout);
                }
            });
        })
    }
};

export default PythonExecutor;