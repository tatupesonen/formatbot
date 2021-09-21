import { languageMappings } from '../formatters/FormatterMappings';
import { IParser } from '../interfaces/IParser';
import { checkIfLanguageSupported } from './utils';
export type CodeBlock = {
  type: 'code';
  content: string;
  languageKey?: keyof typeof languageMappings;
  order: number;
};

/**
 *
 * @param content
 * @returns
 */
export class Parser implements IParser {
  parseMessage = (content: string): CodeBlock[] | [] => {
    const matchCodeBlocksRegex = /(```).*?(```)/gs;
    const langKeyRegex = new RegExp(
      '```\\b(' + Object.keys(languageMappings).join('|') + ')\\b',
      'i'
    );
    const codeblocks = [...content.matchAll(matchCodeBlocksRegex)].map(
      ([first]) => first
    );
    const messageBlocks: CodeBlock[] = codeblocks.map((block, idx) => {
      const [firstLine] = block.split('\n');
      //Figure out the language key, if any
      const languageKey = firstLine.match(langKeyRegex);
      console.log(languageKey, langKeyRegex);
      // Check if the languageKey is something that we support.
      let languageSupported = false;
      if (languageKey) {
        // TODO: Improve this logic. Perhaps put use capture groups and put it in the match regex.
        languageKey[0] = languageKey[0]
          .replace('```', '')
          .replace('\n', '')
          .toLowerCase();
        languageSupported = checkIfLanguageSupported(languageKey[0]);
      }
      const blockWithNoBackticks = block
        // Remove first backticks and language key
        .replace(langKeyRegex, '')
        // Replace all remaining triple backticks for this block
        .replaceAll(/```/g, '')
        // Remove ending & beginning whitespace
        .replace(/^\s+|\s+$/g, '');
      return {
        content: blockWithNoBackticks,
        type: 'code',
        order: idx,
        ...(languageSupported && {
          languageKey: languageKey[0] as keyof typeof languageMappings,
        }),
      };
    });

    return messageBlocks ?? [];
  };
}
