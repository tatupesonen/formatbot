import { languageMappings } from '../formatters/FormatterMappings';

export function messageBlockToLines(messageblock: string) {
  return messageblock.split('\n');
}

export type BlockDetail = {
  start: number;
  end: number | null;
  mode: Mode;
  ext?: keyof typeof languageMappings;
};

export enum Mode {
  CODE = 'CODE',
  TEXT = 'TEXT',
}

export function isCodeBlock(line: string) {
  return line.includes('```');
}

export function readMessageBlock(lines: string[]) {
  return lines.reduce<BlockDetail[]>((acc, curr, i) => {
    const prevItem = acc[acc.length - 1];

    // Initialize
    if (!prevItem) {
      acc.push({
        start: i,
        end: null,
        mode: isCodeBlock(curr) ? Mode.CODE : Mode.TEXT,
        ext: isCodeBlock(curr) ? curr.replace('```', '') : null,
      });

      return acc;
    }

    // Find out if a codeblock ends
    if (isCodeBlock(curr) && prevItem.mode === Mode.CODE) {
      // console.log("hii");
      // Change the current one
      prevItem.end = i + 1;

      acc.push({
        start: i + 1,
        end: null,
        mode: Mode.TEXT,
      });
      // acc[acc.length] = {
      // };
    }

    if (isCodeBlock(curr) && prevItem.mode === Mode.TEXT) {
      prevItem.end = i;

      acc.push({
        start: i,
        end: null,
        mode: isCodeBlock(curr) ? Mode.CODE : Mode.TEXT,
        ext: curr.replace('```', ''),
      });
    } else {
      acc[acc.length - 1].end = i;
    }

    return acc;
  }, []);
}

export const getMessageBlocks = (content: string) => {
  const result = readMessageBlock(messageBlockToLines(content));
  const split = content.split('\n');
  const mapped = result.map((e) => {
    let content = split.slice(e.start, e.end);
    if (content.length > 0) {
      content[0] = content[0].replace(`\`\`\`${e.ext}`, '');
      content[content.length - 1] = content[content.length - 1].replace(
        '```',
        ''
      );
      if (!content[0]) {
        content.shift();
      }
      if (!content[content.length - 1]) {
        content.pop();
      }
    }
    return { content, ext: e.ext };
  });
  // mapped.forEach((e) => {
  //   if (!e.content) return;
  // e.content[0] = e.content[0].replace(`\`\`\`${e.ext}`, '');
  //   if (e.content[e.content.length - 1]) {
  //     e.content[e.content.length - 1] = e.content[e.content.length - 1].replace(
  //       '```',
  //       ''
  //     );
  //   }
  // });
  return mapped;
};
