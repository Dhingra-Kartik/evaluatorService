import createContainer from './containerFactory.js';
import { CPP_IMAGE } from '../utils/constants.js';
import decodeDockerStream from './dockerHelper.js';


async function runCpp(code: string, inputTestCase: string){
    const rawbuffer: Buffer[] = [];
    //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
    const runCommand = `echo '${code.replace(/'/g,`'\\"`)}' > main.cpp && g++ main.cpp -o main && echo ${inputTestCase.replace(/'/g,`'\\"`)} | ./main`;

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

    await cppDockerContainer.remove();
}

export default runCpp;