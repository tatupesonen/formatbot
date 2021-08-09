/**
 * @param stringToReplace The string that'll be replaced
 * @param regex The regex used to match the string, using the global flag "g" is recommended
 * @param callback replacerFunction, this function will be called for every match for the regex and replace it with the result of the callback
 */
export async function asyncStringReplacer(
  stringToReplace: string,
  regex: RegExp,
  callback: (str: string) => string | Promise<string>
): Promise<string | null> {
  const matched = stringToReplace.match(regex);
  //If stringToReplace doesn't have a codeblock, return null
  if (!matched) return null;
  //Format the matched strings according to the callback
  const formatted = await Promise.all(matched.map(callback));
  const result = matched.reduce((prev, curr, ind) => {
    //The string with the matched values replaced with it's corresponding "formatted string"
    return prev.replace(curr, formatted[ind]);
  }, stringToReplace);
  return result;
}
/**
 *
 * @param str The single line string that'll be added comments to
 * @param language The language identifier for the specific style of comments
 * @returns The line as a comment, if the language key isn't provided or isn't supported it just returns the original string
 */
export function commentify(str: string, language?: string): string {
  switch (language) {
    case 'js':
    case 'javascript':
    case 'typescript':
    case 'ts':
      return '//' + str;
    case 'jsx':
    case 'tsx':
    case 'css':
      return '/*' + str + '*/';
    case 'html':
      return '<!--' + str + '-->';
    case 'python':
    case 'py':
      return '#' + str;
    default:
      return str;
  }
}
