import axios from 'axios';
import { BaseFormatter, IFormatter } from '../BaseFormatter';
import { CouldNotFormatError } from '../errors/errors';

export class CppFormatter extends BaseFormatter implements IFormatter {
  public async format(code: string): Promise<string> {
    let formatted;
    try {
      const { data } = await axios.post(
        'https://godbolt.org/api/format/clangformat',
        {
          base: 'Google',
          source: code,
          tabWidth: 2,
          useSpaces: true,
        }
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
