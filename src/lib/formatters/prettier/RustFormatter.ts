import axios from 'axios';
import { Console } from 'console';
import { BaseFormatter, IFormatter } from '../BaseFormatter';
import { CouldNotFormatError } from '../errors/errors';

export class RustFormatter extends BaseFormatter implements IFormatter {
  // Defaults to normal JavaScript but ctor can be overridden
  constructor(options: any = { semi: true, parser: 'babel' }) {
    super(options);
  }
  public async format(code: string): Promise<string> {
    let formatted;
    try {
      console.log('Called');
      const {
        data,
      } = await axios.post('https://godbolt.org/api/format/rustfmt', {
        base: '',
        source: code,
      });
      console.log('Data: ', data);
      formatted = data.answer;
      return formatted;
    } catch (err) {
      console.log(err);
      throw new CouldNotFormatError(
        `Could not format using ${this.constructor.name}`
      );
    }
  }
}
