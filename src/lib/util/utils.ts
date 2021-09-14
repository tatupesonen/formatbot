import { languageMappings } from '../formatters/FormatterMappings';

/**
 * @param match The matched substring.
 * @param offset The offset of the matched substring within the whole string being examined. (For example, if the whole string was 'abcd', and the matched substring was 'bc', then this argument will be 1.)
 * @param string The whole string being examined.
 * @param groups In browser versions supporting named capturing groups, will be an object whose keys are the used group names, and whose values are the matched portions (undefined if not matched).
 * @param capturedGroups An object of named capturing groups whose keys are the names and values are the capturing groups or undefined if no named capturing groups were defined. See [Groups and Ranges](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges) for more information.
 * @returns {string|Promise<string>}
 */
type asyncStringReplacerFn = (
  match: string,
  offset: number | undefined,
  string: string,
  groups?: { [key: string]: string },
  ...capturedGroups: Array<string>
) => string | Promise<string>;
/**
 * @param stringToReplace The string that'll be replaced
 * @param regex The regex used to match the string, using the global flag "g" is recommended
 * @param callback replacerFunction, this function will be called for every match for the regex and replace it with the result of the callback
 */
export async function asyncStringReplacer(
  stringToReplace: string,
  regex: RegExp,
  // TODO add string parameters
  callback: asyncStringReplacerFn
): Promise<string | null> {
  const matched = stringToReplace.match(regex);
  //If stringToReplace doesn't have a code block, return null
  if (!matched) return null;
  // If it's a global regex
  if (regex.global) {
    const matches = matched.map((val) => {
      // Create a non-global regex from the provided regex
      const singleMatched = val.match(new RegExp(regex.source));
      // Not possible since it only loops through the matches but for typesript
      if (!singleMatched) return val;
      // The first element is the matched substring, the others are the capture groups
      const [match, ...capturedGroup] = singleMatched;
      return callback(
        match,
        singleMatched.index,
        stringToReplace,
        singleMatched.groups,
        ...capturedGroup
      );
    });
    // Use the callback to get an array of results for each matches
    const formatted = await Promise.all(matches);

    const result = matched.reduce((prev, curr, ind) => {
      // The string with the matched values replaced with it's corresponding "formatted string"
      return prev.replace(curr, formatted[ind]);
    }, stringToReplace);
    return result;
  } else {
    const [match, ...capturedGroup] = matched;
    // Format the string according to the callback
    const replacedValue = await callback(
      match,
      matched.index,
      stringToReplace,
      matched.groups,
      ...capturedGroup
    );
    return stringToReplace.replace(match, replacedValue);
  }
}

export const checkIfLanguageSupported = (languageKey: string) =>
  languageKey ? Object.keys(languageMappings).includes(languageKey) : false;

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
    case 'c':
    case 'cpp':
    case 'csharp':
    case 'cs':
    case 'java':
    case 'rust':
    case 'ts':
      return '// ' + str;
    case 'jsx':
    case 'tsx':
    case 'css':
      return '/* ' + str + ' */';
    case 'html':
      return '<!-- ' + str + ' -->';
    case 'python':
    case 'yml':
    case 'yaml':
    case 'py':
      return '# ' + str;
    default:
      return '// ' + str;
  }
}
