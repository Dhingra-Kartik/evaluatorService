import Docker from 'dockerode';

export default async function pullImage(imageName: string) {
  try {
    const docker = new Docker();
    return new Promise((resolve, reject) => {
      docker.pull(imageName, (err: Error, stream: NodeJS.ReadableStream) => {
        if (err) return reject(err);

        docker.modem.followProgress(
          stream,
          (err, output) => {
            if (err) return reject(err);
            resolve(output); // resolve the promise with the pull result
          },
          (event) => {
            console.log(event.status); // logs progress events
          }
        );
      });
    });
  } catch (err) {
    console.error(err);
  }
}
