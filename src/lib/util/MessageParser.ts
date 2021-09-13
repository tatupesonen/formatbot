import { languageMappings } from '@/lib/formatters/FormatterMappings';
type TextBlock = {
  type: 'text';
  content: string;
  order: number;
};
type CodeBlock = {
  type: 'code';
  content: string;
  languageKey?: keyof typeof languageMappings;
  order: number;
};
export type MessageBlock = CodeBlock | TextBlock;

export const parseMessage = (content: string): MessageBlock[] => {
  // TODO
  return [{ content, order: 0, type: 'text' }];
};
