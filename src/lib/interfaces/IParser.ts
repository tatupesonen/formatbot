import { CodeBlock } from '../util/MessageParser';

export interface IParser {
  parseMessage(content: string): CodeBlock[];
}
