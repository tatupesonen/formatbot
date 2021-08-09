import { newUnibeautify } from 'unibeautify';
import beautifier from '@unibeautify/beautifier-black';

import { BaseFormatter, IFormatter } from '../BaseFormatter';
import { CouldNotFormatError } from '../errors/errors';

export class PythonFormatter extends BaseFormatter implements IFormatter {
  // Defaults to normal JavaScript but ctor can be overridden
  constructor(options: any = { semi: true, parser: 'babel' }) {
    super(options);
  }
  public async format(code: string): Promise<string> {
    try {
      const unibeautify = newUnibeautify();
      unibeautify.loadBeautifier(beautifier);
      const formatted = unibeautify.beautify({
        text: code,
        languageName: 'Python',
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
