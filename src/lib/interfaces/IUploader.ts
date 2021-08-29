export interface IUploader {
  upload(content: string, languageKey?: string): Promise<string>;
}
