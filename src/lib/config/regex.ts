import { languageMappings } from '../formatters/FormatterMappings';

export const regexConfig = {
  codeBlockRegex: new RegExp(
    '' + // Prettier hack lol
      // Match first 3 backticks
      '```' +
      // Match language identifier
      // Will not match if there's no content after the identifier to mimic Discord's behavior
      '(?<lang>' +
      Object.keys(languageMappings).join('|') +
      '(?=\\n[^`{3}]))?' +
      // Match content
      '(?<content>.*?)' +
      // Match last 3 backticks
      '```',
    'sg'
  ),
};
