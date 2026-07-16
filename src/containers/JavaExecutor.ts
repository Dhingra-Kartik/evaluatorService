
import createContainer from './containerFactory.js';
import { JAVA_IMAGE } from '../utils/constants.js';
import decodeDockerStream from './dockerHelper.js';
// import pullimage from './pullImage.js';
import type CodeExecutorStrategy from './codeExecutorStrategy.js';
import type { ExecutionResponse } from './codeExecutorStrategy.js';

class JavaExecutor implements CodeExecutorStrategy {
    // private ready: Promise<any>;
    
        constructor(){
            // this.ready = pullimage(CPP_IMAGE);
        }

    async execute(code: string, inputTestCase: string, outputTestCase :string): Promise<ExecutionResponse> {
        console.log(code, inputTestCase, outputTestCase);
        console.log("Java executor called");
        const rawbuffer: Buffer[] = [];
        // await this.ready;

        //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo ${inputTestCase.replace(/'/g, `'\\"`)} | java Main`;

        const javaDockerContainer = await createContainer(JAVA_IMAGE, [
            '/bin/sh',
            '-c',
            runCommand
        ]);

        await javaDockerContainer.start();
        console.log("STARTED DOCKER CONTAINER");

        const loggerStream = await javaDockerContainer.logs({
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
                await javaDockerContainer.kill();  //we will first stop it 
            }
            return { output: err as string, status: "ERROR" }

        } finally {
            await javaDockerContainer.remove(); //then remove it 

        }

    }

    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawbuffer: Buffer[]): Promise<string> {
        return new Promise((res, rej) => {
            const timeout = setTimeout(() => {
                console.log("Timeout called");
                rej("TLE"); //you rejected it but execution is still going on
            }, 40000);
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


export default JavaExecutor;