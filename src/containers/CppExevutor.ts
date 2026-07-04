import createContainer from './containerFactory.js';
import { CPP_IMAGE } from '../utils/constants.js';
import decodeDockerStream from './dockerHelper.js';
import pullimage from './pullImage.js';
import type CodeExecutorStrategy from './codeExecutorStrategy.js';
import type { ExecutionResponse } from './codeExecutorStrategy.js';

class CppExecutor implements CodeExecutorStrategy {
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {

        const rawbuffer: Buffer[] = [];
        await pullimage(CPP_IMAGE);
        //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo ${inputTestCase.replace(/'/g, `'\\"`)} | ./main`;

        const cppDockerContainer = await createContainer(CPP_IMAGE, [
            '/bin/sh',
            '-c',
            runCommand
        ]);

        await cppDockerContainer.start();
        console.log("STARTED DOCKER CONTAINER");

        const loggerStream = await cppDockerContainer.logs({
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
            await cppDockerContainer.remove();

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
}

export default CppExecutor;