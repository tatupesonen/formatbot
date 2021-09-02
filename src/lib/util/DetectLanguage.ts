import { exec } from 'child_process';
import { logger } from './logger';
export const detect = (code: string): Promise<string> => {
  return new Promise((resolve, _) => {
    let escaped = code.replaceAll("'", "\\'");
    escaped = code.replaceAll('"', '\\"');
    const command = `echo "${escaped}" | guesslang`;
    const shell = exec(command);

    shell.stdout.on('data', function (data) {
      resolve(data.toString());
    });

    shell.stderr.on('data', (data) => {
      logger.error("Couldn't parse input: " + escaped);
      resolve(data.toString());
    });
  });
};
