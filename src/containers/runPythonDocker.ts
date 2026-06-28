
import createContainer from './containerFactory.js';
import { PYTHON_IMAGE } from '../utils/constants.js';
import decodeDockerStream from './dockerHelper.js';
import pullimage from './pullImage.js';


async function runPython(code: string, inputTestCase: string){
    const rawbuffer: Buffer[] = [];
    await pullimage(PYTHON_IMAGE);
    //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
    const runCommand = `echo '${code.replace(/'/g,`'\\"`)}' > test.py && echo ${inputTestCase.replace(/'/g,`'\\"`)} | python3 test.py`;

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

    await pythonDockerContainer.remove();
}

export default runPython;