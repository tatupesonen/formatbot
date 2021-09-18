import { exec } from 'child_process';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { languageNameMappings } from '../formatters/FormatterMappings';
import { DetectedLanguage, IDetector } from '../interfaces/IDetector';
import { logger } from './logger';

export class GuesslangDetector implements IDetector {
  detect(code: string): Promise<DetectedLanguage> {
    return new Promise(async (resolve, _) => {
      // Create the file
      const fileName = randomUUID();
      const folderPath = path.join(__dirname, '/../../../temp/');
      const filePath = path.join(folderPath, fileName);
      // Create temp folder if it doesn't exist
      if (!existsSync(folderPath)) {
        logger.warn("Created a new temp folder since it didn't exist yet.");
        await fs.mkdir(folderPath);
      }
      await fs.writeFile(filePath, code, {
        encoding: 'utf-8',
      });
      logger.info(`Created ${filePath}`);

      const command = `guesslang ${filePath}`;
      const shell = exec(command);

      shell.stdout.on('data', function (data) {
        resolve({ data: data.toString(), filePath });
      });

      shell.stderr.on('data', (data) => {
        logger.error(data);
        resolve({ data: data.toString(), filePath });
      });
    }).then(({ data, filePath }) => {
      // Unlink
      try {
        logger.debug(`Unlinking ${filePath}`);
        fs.unlink(filePath);
      } catch (e) {
        logger.error(`Couldn't unlink ${filePath}`);
      }
      const split = data.split(':')[1].trim();
      const lang = Object.entries(languageNameMappings).find(
        ([_key, value]) => value === split
      );
      return {
        langKey: lang ? lang[0] : null,
        fullLangName: split,
      } as DetectedLanguage;
    });
  }
}
