import axios from 'axios';
import { BaseFormatter, IFormatter } from '../BaseFormatter';
import { CouldNotFormatError } from '../errors/errors';

export class CppFormatter extends BaseFormatter implements IFormatter {
  // Defaults to normal JavaScript but ctor can be overridden
  constructor(options: any = { semi: true, parser: 'babel' }) {
    super(options);
  }
  public async format(code: string): Promise<string> {
    let formatted;
    try {
      const { data } = await axios.post(
        'https://godbolt.org/api/format/clangformat',
        { base: 'Google', source: code }
      );
      formatted = data.answer;
      return formatted;
    } catch {
      throw new CouldNotFormatError(
        `Could not format using ${this.constructor.name}`
      );
    }
  }
}
