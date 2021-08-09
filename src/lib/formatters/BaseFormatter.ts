export abstract class BaseFormatter implements IFormatter {
  private formatterOptions: any;
  public constructor(options: any) {
    this.formatterOptions = options;
  }
  getFormatterOptions() {
    return this.formatterOptions;
  }
  public abstract format(code: string): Promise<string>;
}

export interface IFormatter {
  getFormatterOptions(): any;
  format(code: string): Promise<string>;
}
