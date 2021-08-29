export abstract class BaseFormatter<T = unknown> implements IFormatter {
  private formatterOptions;
  public constructor(options?: T) {
    this.formatterOptions = options;
  }
  getFormatterOptions() {
    return this.formatterOptions;
  }
  public abstract format(code: string): Promise<string>;
}

export interface IFormatter {
  getFormatterOptions();
  format(code: string): Promise<string>;
}
