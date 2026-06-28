
import createContainer from './containerFactory.js';
import { JAVA_IMAGE } from '../utils/constants.js';
import decodeDockerStream from './dockerHelper.js';


async function runJava(code: string, inputTestCase: string){
    const rawbuffer: Buffer[] = [];
    //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
    const runCommand = `echo '${code.replace(/'/g,`'\\"`)}' > Main.java && javac Main.java && echo ${inputTestCase.replace(/'/g,`'\\"`)} | java Main`;

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
        timestamps: true,
        follow: true
    });

    loggerStream.on('data', (chunk)=>{
        rawbuffer.push(chunk);
    });

    await new Promise((res)=>{

        loggerStream.on('end', ()=>{
            console.log(rawbuffer);
            const completedBuffer = Buffer.concat(rawbuffer);
            const decodedStream = decodeDockerStream(completedBuffer);
            console.log(decodedStream);
            res(decodeDockerStream);
        });
    })

    await javaDockerContainer.remove();
}

export default runJava;