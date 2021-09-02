export interface IDetector {
  detect(arg: string): Promise<string>;
}
