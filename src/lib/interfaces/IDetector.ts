import { languageNameMappings } from '../formatters/FormatterMappings';

export interface IDetector {
  detect(arg: string): Promise<DetectedLanguage>;
}

export interface DetectedLanguage {
  langKey: keyof typeof languageNameMappings | null;
  fullLangName: string | null;
}
