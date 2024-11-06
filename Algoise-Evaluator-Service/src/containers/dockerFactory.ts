import Docker from "dockerode";
async function createContainer(image: string, cmdExecutable: string[]) {
  const docker = new Docker();
  const container = docker.createContainer({
    Image: image,
    Cmd: cmdExecutable,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    HostConfig: {
      Memory: 1024 * 1024 * 512, //512 mb memory limit
    },
    OpenStdin: true, //keep the input stream open even if there is no interaction
  });
  return container;
}
export default createContainer;
