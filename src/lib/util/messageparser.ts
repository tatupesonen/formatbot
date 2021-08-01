import { languageMappings } from '../formatters/FormatterMappings';
enum Mode {
  TEXT,
  CODE,
}
type Lines = string[];
export interface TextBlock {
  lines: Lines;
}
export interface CodeBlock {
  language: keyof typeof languageMappings;
  lines: Lines;
}
export interface ParsedOutput {
  blocks: (CodeBlock | TextBlock)[];
}

export const parseMessage = (content: string) => {
  // First of all, get all lines of the message.

  const lines = content.split('\n');

  let mode = Mode.TEXT;
  let output: ParsedOutput = { blocks: [] };
  let block: TextBlock | CodeBlock = { lines: [] };
  let isNewLineOfBlock = true;
  for (const line of lines) {
    if (line.startsWith('```')) {
      // New block begins
      // Commit old block
      output.blocks.push({ lines: [...block.lines] });
      block = { lines: [] };
      if (isNewLineOfBlock) {
        (block as CodeBlock).language = line.replace('```', '')[0].trim();
        isNewLineOfBlock = false;
        mode = Mode.CODE;
      }
    }
    if (line.endsWith('```')) {
      // New block begins
      output.blocks.push({ lines: [...block.lines] });
      block = { lines: [] };
      mode = Mode.TEXT;
      isNewLineOfBlock = true;
    }
    if (Mode.CODE) {
      block.lines.push(line.replace('```', ''));
    }
    if (Mode.TEXT) {
      block.lines.push(line);
    }
  }
  // Filter output
  return output;
};
