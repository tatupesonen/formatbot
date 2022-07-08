import { languageMappings } from '../formatters/FormatterMappings';
import { IParser } from '../interfaces/IParser';
import { checkIfLanguageSupported } from './utils';
import { regexConfig } from '../config/regex';

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
    const codeblocks = [...content.matchAll(regexConfig.codeBlockRegex)];

    const messageBlocks: CodeBlock[] = codeblocks.map((match, idx) => {
      const { lang, content } = match.groups;

      const languageSupported = lang && checkIfLanguageSupported(lang);

      return {
        content: content.trim(),
        type: 'code',
        order: idx,
        // TODO
        // Alarms are going off in my head due to this line
        // Find a better way to assert language support later
        ...(languageSupported && {
          languageKey: lang as keyof typeof languageMappings,
        }),
      };
    });

    return messageBlocks ?? [];
  };
}
