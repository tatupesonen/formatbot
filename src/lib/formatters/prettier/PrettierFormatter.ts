import prettier from 'prettier';

import { BaseFormatter, IFormatter } from '../BaseFormatter';
import { CouldNotFormatError } from '../errors/errors';

export class PrettierFormatter
  extends BaseFormatter<{ semi: boolean; parser: string }>
  implements IFormatter
{
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
