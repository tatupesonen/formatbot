import { Message } from 'discord.js';
import { Container } from '../container/container';
import { languageMappings } from '../formatters/FormatterMappings';
import { IDetector } from '../interfaces/IDetector';
import { IUploader } from '../interfaces/IUploader';
import { logger } from './logger';
import { reformat } from './reformatter';
import { asyncStringReplacer, commentify } from './utils';

export const formatMessage = async (
  message: Message,
  container: Container,
  //TODO add onlyCodeBlocks feature
  _onlyCodeBlocks?: boolean
) => {
  // Get dependencies
  const uploader = container.getByKey<IUploader>('uploader');
  const detector = container.getByKey<IDetector>('detector');

  const content = message.content;
  // The first language key found, it'll be used for the pastecord file and all the comments on the file
  const firstLanguageKey: string | undefined = content.match(
    new RegExp(`\`\`\`(${Object.keys(languageMappings).join('|')})\n`, 'm')
  )?.[1];
  // The message's content with the code blocks and their contents removed
  let contentWithoutCode = content;
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
          const commented = commentify(match, firstLanguageKey);
          contentWithoutCode = contentWithoutCode.replace(match, '\n');
          // Replace this line with it's commented version
          prettiedPastecordCode = prettiedPastecordCode.replace(
            match,
            commented
          );
          // returning match itself means nothing will be changed
          return match;
        }
        // For empty codeblocks, remove the content
        unformattableCodeBlockCounter++;
        // Returning '' will completely remove the empty code block
        return '';
      }
      const theCode = codeContent.trim();
      const languageFormatter = languageMappings[language];
      // If "language" is undefined or unsupported for formatting, return the original code block with it's content
      if (!languageFormatter) {
        // If no formatter, try to find a language.
        logger.info(`Trying to autodetect code:\n${theCode}`);
        const { langKey, fullLangName } = await detector.detect(theCode);
        if (!langKey)
          return (
            "Couldn't find a compatible formatter. Found language: " +
            fullLangName
          );
        logger.info('Found language: ' + fullLangName);
        const formatterToUse = languageMappings[langKey];
        const formattedCode =
          (await formatterToUse
            .format(theCode)
            .then((code) => code.trim())
            .catch(() => undefined)) ?? "Couldn't format this snippet.";
        return reformat(formattedCode, langKey ?? '');
        // Find formatter to use!
        unformattableCodeBlockCounter++;
        // This is for unsupported multi line code blocks, each line gets commented and replaced to be sent on the pastecord
        const commented = match
          .split('\n')
          .map((val) => commentify(val, firstLanguageKey))
          .join('\n');
        contentWithoutCode = contentWithoutCode.replace(match, '\n');

        prettiedPastecordCode = prettiedPastecordCode.replace(match, commented);
        // returning match itself means nothing will be changed
        return match;
      }
      // Remove the entire code block
      contentWithoutCode = contentWithoutCode.replace(match, '\n');
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
      return match.replace(codeContent, '\n' + formattedCode.trim() + '\n');
    }
  );
  if (!prettifiedCode) {
    throw new Error("This doesn't have any code blocks");
  }
  // If all the codeblocks were unformattable, cancel
  if (unformattableCodeBlockCounter === codeBlockCounter)
    throw new Error('No Formattable code block');

  // This is what the bot will send
  let replyContent = prettifiedCode;
  // The max character limit for discord message contents is 2000
  if (replyContent.length > 1999) {
    prettiedPastecordCode = contentWithoutCode
      .split('\n')
      .reduce((prev, curr, ind) => {
        // Return the previous value should the element be "" instead of adding empty comments
        if (curr.trim() === '') return prev;
        // For non code block content, if it's the first line, it shouldn't start with \n
        return prev.replace(
          (ind === 0 ? '' : '\n') + curr,
          '\n' + commentify(curr, firstLanguageKey)
        );
      }, prettiedPastecordCode);
    // The formatted code to be sent to pastecord
    const prettyPasteCord = await uploader.upload(
      prettiedPastecordCode,
      firstLanguageKey
    );
    replyContent = `Formatted code was too large to send through discord\nFormatted Code: ${prettyPasteCord}`;
  }
  return replyContent;
};
