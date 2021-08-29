import { newUnibeautify } from 'unibeautify';
import beautifier from '@unibeautify/beautifier-prettydiff';

import { BaseFormatter, IFormatter } from '../BaseFormatter';
import { CouldNotFormatError } from '../errors/errors';

export class CSharpFormatter extends BaseFormatter implements IFormatter {
  public async format(code: string): Promise<string> {
    try {
      const unibeautify = newUnibeautify();
      unibeautify.loadBeautifier(beautifier);
      const formatted = unibeautify.beautify({
        text: code,
        languageName: 'C#',
        options: {},
      });
      return formatted;
    } catch {
      throw new CouldNotFormatError(
        `Could not format using ${this.constructor.name}`
      );
    }
  }
}
