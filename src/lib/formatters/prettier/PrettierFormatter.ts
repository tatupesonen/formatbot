import prettier from 'prettier';

import { BaseFormatter, IFormatter } from '../BaseFormatter';
import { CouldNotFormatError } from '../errors/errors';

export class PrettierFormatter extends BaseFormatter implements IFormatter {
  // Defaults to normal JavaScript but ctor can be overridden
  constructor(options = { semi: true, parser: 'babel' }) {
    super(options);
  }
  public async format(code: string): Promise<string> {
    try {
      const formatted = prettier.format(code, super.getFormatterOptions());
      return formatted;
    } catch {
      throw new CouldNotFormatError(
        `Could not format using ${this.constructor.name}`
      );
    }
  }
}
