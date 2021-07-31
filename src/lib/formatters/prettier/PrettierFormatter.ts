import prettier from 'prettier';
import { BaseFormatter, IFormatter } from '../BaseFormatter';

export class PrettierFormatter extends BaseFormatter implements IFormatter {
  // Defaults to normal JavaScript but ctor can be overridden
  constructor(private readonly options: any = { semi: true, parser: 'babel' }) {
    super(options);
  }
  public format(code: string): string {
    try {
      const formatted = prettier.format(code, super.getFormatterOptions());
      return formatted;
    } catch {
      throw new Error(`Couldn't format using ${this.constructor.name}`);
    }
  }
}
