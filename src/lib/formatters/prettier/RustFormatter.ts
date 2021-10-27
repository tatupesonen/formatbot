import axios from 'axios';
import { logger } from '../../util/logger';
import { BaseFormatter, IFormatter } from '../BaseFormatter';
import { CouldNotFormatError } from '../errors/errors';

export class RustFormatter extends BaseFormatter implements IFormatter {
  public async format(code: string): Promise<string> {
    let formatted;
    try {
      const { data } = await axios.post(
        'https://godbolt.org/api/format/rustfmt',
        {
          base: '',
          source: code,
          tabWidth: 2,
          useSpaces: true,
        }
      );
      formatted = data.answer;
      return formatted;
    } catch (err) {
      logger.warn(`Could not format code using ${this.constructor.name}`);
      throw new CouldNotFormatError(
        `Could not format using ${this.constructor.name}`
      );
    }
  }
}
