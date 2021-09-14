export const reformat = (code: string, languageKey): string => {
  return `\`\`\`${languageKey}\n${code}\`\`\``;
};
