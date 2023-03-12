import { languageMappings } from '../formatters/FormatterMappings';

// Match user mentions as per https://discord.com/developers/docs/reference#message-formatting
export const userMentionRegExp = (id: string) =>
  new RegExp(String.raw`^\s*<@!?${id}>\s*$`);

export const codeBlockRegExp = new RegExp(
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
);
