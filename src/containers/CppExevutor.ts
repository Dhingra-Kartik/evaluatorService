import createContainer from './containerFactory.js';
import { CPP_IMAGE } from '../utils/constants.js';
import decodeDockerStream from './dockerHelper.js';
// import pullimage from './pullImage.js';
import type CodeExecutorStrategy from './codeExecutorStrategy.js';
import type { ExecutionResponse } from './codeExecutorStrategy.js';

class CppExecutor implements CodeExecutorStrategy {
    // private ready: Promise<any>;

    constructor(){
        // this.ready = pullimage(CPP_IMAGE);
    }

    async execute(code: string, inputTestCase: string, outputTestCase :string): Promise<ExecutionResponse> {

        console.log(code, inputTestCase, outputTestCase);
        console.log("CPP executor called");
        const rawbuffer: Buffer[] = [];
        // await this.ready;
        
        
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
            timestamps: false,
            follow: true
        });

        loggerStream.on('data', (chunk) => {
            rawbuffer.push(chunk);
        });

        try {
            const rawResponse: string = await this.fetchDecodedStream(loggerStream, rawbuffer);
            const codeResponse = rawResponse.replace(/^\d{4}-\d{2}-\d{2}T[^\s]+\s/, "").trim();

            if(codeResponse.trim() === outputTestCase.trim()){
                return { output: codeResponse, status: "SUCCESS" };
            } else {
                return { output: codeResponse, status: "WRONG ANSWER" };
            }
        } catch (err) {
            console.log("Error Occured", err);
            if(err === "TLE") {
                await cppDockerContainer.kill();  //we will first stop it 
            }
            return { output: err as string, status: "ERROR" }

        } finally {
            await cppDockerContainer.remove();

        }

    }

    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawbuffer: Buffer[]): Promise<string> {
        return new Promise((res, rej) => {
            const timeout = setTimeout(() => {
                console.log("Timeout called");
                rej("TLE");
            }, 20000);
            loggerStream.on('end', () => {
                clearTimeout(timeout);
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