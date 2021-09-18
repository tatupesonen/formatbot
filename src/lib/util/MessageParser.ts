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
      `(${Object.keys(languageMappings).join('|')})`,
      'm'
    );
    const codeblocks = [...content.matchAll(matchCodeBlocksRegex)].map(
      ([first]) => first
    );
    const messageBlocks: CodeBlock[] = codeblocks.map((block, idx) => {
      const [firstLine] = block.split('\n');
      //Figure out the language key, if any
      const languageKey = firstLine.match(langKeyRegex);
      // Check if the languageKey is something that we support.
      let languageSupported = false;
      if (languageKey) {
        languageSupported = checkIfLanguageSupported(languageKey[0]);
      }
      const blockWithNoBackticks = block
        // Remove first backticks and language key
        .replace(
          new RegExp(`\`\`\`(${Object.keys(languageMappings).join('|')})\n`),
          ''
        )
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
