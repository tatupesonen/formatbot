import {
  Message,
  MessageReaction,
  PartialMessageReaction,
  User,
} from 'discord.js';
import {
  languageMappings,
  languageNameMappings,
} from '../formatters/FormatterMappings';
import { UploadToPastecord } from '../infra/external/pastecordintegration';
import { reformat } from './reformatter';
import { asyncStringReplacer, commentify } from './utils';

export const formatMessage = async (message: Message) => {
  const content = message.content;
  // The first language key found, it'll be used for the pastecord file and all the comments on the file
  let firstLanguageKey: string | undefined;
  // The message's content with the code blocks and their contents removed
  let contentWithoutCode = content;
  // The content that'll be uploaded to pastecord
  let pastecordCode = content;
  // Should the content be too large to upload, the formatted code will be sent through pastecord and this will be the content
  let prettiedPastecordCode = content;
  // The amount of code blocks in the content
  let codeBlockCounter = 0;
  // The amount of code blocks that weren't formattable
  let unformattableCodeBlockCounter = 0;

  const prettifiedCode = await asyncStringReplacer(
    content,
    /```([^`\n]*)((?:(?:(?!```).)|\n)*)```/g,
    async (match, _offset, _completeString, _groups, language, codeContent) => {
      codeBlockCounter++;
      // For empty code blocks or one liner code blocks
      if (!codeContent.trim()) {
        // For one liners
        if (language.trim() && !languageMappings[language]) {
          unformattableCodeBlockCounter++;
          return match;
        }
        // For empty codeblocks, remove the content
        unformattableCodeBlockCounter++;
        return '';
      }
      // If firstLanguage is undefined and language is a valid languagekey, it sets the value
      if (!firstLanguageKey && languageNameMappings[language])
        firstLanguageKey = language.trim();
      const theCode = codeContent.trim();
      // Remove the entire code block
      contentWithoutCode = contentWithoutCode.replace(match, '\n');
      // Remove the code block formatting and adds it's content
      pastecordCode = pastecordCode.replace(match, '\n' + codeContent + '\n');
      const languageFormatter = languageMappings[language];
      // If "language" is undefined or unsupported for formatting, return the original code block with it's content
      if (!languageFormatter) {
        unformattableCodeBlockCounter++;
        return match;
      }
      // Format the code, if it's unformattable, return null
      const formattedCode = await languageFormatter
        .format(theCode)
        .then((code) => code.trim())
        .catch(() => null);
      prettiedPastecordCode = prettiedPastecordCode.replace(
        match,
        '\n' +
          (formattedCode ??
            commentify('Could not format this snippet\n', language) +
              codeContent) +
          '\n'
      );
      if (!formattedCode) {
        unformattableCodeBlockCounter++;
        return reformat(
          commentify('Could not format this snippet', language) + codeContent,
          language
        );
      }
      //Replace the string's code with the formatted code inside a code block
      return match.replace(theCode, formattedCode);
    }
  );
  if (!prettifiedCode) {
    throw new Error("This doesn't have any code blocks");
  }
  // If all the codeblocks were unformattable, cancel
  if (unformattableCodeBlockCounter === codeBlockCounter)
    throw new Error('No Formattable code block');

  pastecordCode = contentWithoutCode.split('\n').reduce((prev, curr) => {
    // Return the previous value should the element be "" instead of adding empty comments
    if (curr === '') return prev;
    return prev.replace(curr, commentify(curr, firstLanguageKey));
  }, pastecordCode);

  // This is what the bot will send
  // The max character limit for discord message contents is 2000
  let replyContent = prettifiedCode;
  if (replyContent.length > 1999) {
    prettiedPastecordCode = contentWithoutCode
      .split('\n')
      .reduce((prev, curr) => {
        // Return the previous value should the element be "" instead of adding empty comments
        if (curr === '') return prev;
        return prev.replace(curr, commentify(curr, firstLanguageKey));
      }, prettiedPastecordCode);
    // The formatted code to be sent to pastecord
    const prettyPasteCord = await UploadToPastecord(
      prettiedPastecordCode,
      firstLanguageKey
    );
    replyContent = `Formatted code was too large to send through discord\nFormatted Code: ${prettyPasteCord}`;
  }
  return replyContent;
};
