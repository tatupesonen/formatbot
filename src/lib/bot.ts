import { combineOperations } from '@bitauth/libauth';
import discord from 'discord.js';
//? The required intents for "messageCreate" and "messageReactionAdd". Events currently listened to 
const client = new discord.Client({"intents": ["GUILDS", "GUILD_MESSAGES", 'GUILD_MESSAGE_REACTIONS']});

import {
  languageMappings,
  languageNameMappings,
} from './formatters/FormatterMappings';
import { UploadToPastecord } from './infra/pastecordintegration';

/**
 * @param stringToReplace The string that'll be replaced
 * @param regex The regex used to match the string, using the global flag "g" is recommended
 * @param callback replacerFunction, this function will be called for every match for the regex and replace it with the result of the callback
 */
async function asyncStringReplacer(
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
function commentify(str: string, language?: string): string {
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
client.on('ready', () => {
  console.log('Bot ready');
});

const allowed_channels = ['871067756794097724', '871059702027542571'];
const operators = ['121777389012385796'];
let deleteOriginalMessage = true;

let trigger_emoji = '🦆';
const delayed_react = '⌚';

client.on('messageCreate', (message) => {
  // Only run in allowed channels
  if (!allowed_channels.includes(message.channel.id)) return;
  if (!operators.includes(message.author.id)) return;

  // User is bot operator
  // Get message args
  const args = message.content.split(' ');
  if (args[0] === '++settrigger' && args[1]) {
    trigger_emoji = args[1];
    message.reply(`Set new trigger to ${trigger_emoji}`);
    return;
  }
  if (args[0] === '++deleteoriginal') {
    deleteOriginalMessage = !deleteOriginalMessage;
    deleteOriginalMessage
      ? message.reply(`<@${client.user.id}> will now delete messages.`)
      : message.reply(`<@${client.user.id}> will not delete messages.`);
      return;
  }
});

client.on('messageReactionAdd', async (reaction) => {
  const { emoji } = reaction;
  // Only run in allowed channels
  if (!allowed_channels.includes(reaction.message.channel.id)) return;
  if (emoji.name === trigger_emoji) {
    // Get time between reaction and message posted
    const timeInSeconds =
      (Date.now() - reaction.message.createdTimestamp) / 1000;
    console.log(timeInSeconds);
    if (timeInSeconds > 30) {
      reaction.message.react(delayed_react);
      return;
    }
    const content = reaction.message.content;

    try {
      // The first language key found, it'll be used for the pastecord file and all the comments on the file
      let firstLanguageKey: string | undefined;
      // The message's content with the code blocks and their contents removed
      let contentWithoutCode = content;
      // The content that'll be uploaded to pastecord
      let pastecordCode = content;
      // Should the content be too large to upload, the formatted code will be sent through pastecord and this will be the content
      let prettiedPastecordCode = content;
      const prettifiedCode = await asyncStringReplacer(
        content,
        /```([^`\n]*)((?:(?:(?!```).)|\n)*)```/g,
        async (str) => {
          /**
           * * 0 The entire matched string
           * * 1 Group 1, The language, example: "js"
           * * 2 The code
           */
          const matches = str.match(/```([^`\n]*)((?:(?:(?!```).)|\n)*)```/);
          // return the original string should there not be matches, this shouldn't happen considering it's iterating through the matched array
          if (!matches) return str;
          // For empty code blocks
          if (!matches[2]) {
            contentWithoutCode = contentWithoutCode.replace(
              matches[0],
              '\n' + matches[0] + '\n'
            );
            return str;
          }
          const language = matches[1];
          // If firstLanguage is undefined, it sets the value
          if (!firstLanguageKey && language) firstLanguageKey = language;
          const theCode = matches[2].trim();
          // Remove the entire code block
          contentWithoutCode = contentWithoutCode.replace(matches[0], '\n');
          // Remove the code block formatting and adds it's content
          pastecordCode = pastecordCode.replace(
            matches[0],
            '\n' + matches[2] + '\n'
          );
          const languageFormatter = languageMappings[language];
          // If "language" is undefined or unsupported for formatting, return the original code block with it's content
          if (!languageFormatter) return str;
          const formattedCode = await languageFormatter.format(theCode);
          prettiedPastecordCode = prettiedPastecordCode.replace(
            matches[0],
            '\n' + formattedCode + '\n'
          );

          //Replace the string's code with the formatted code
          return str.replace(theCode, formattedCode);
        }
      );
      if (!prettifiedCode) {
        throw new Error("This doesn't have any code blocks");
      }
      pastecordCode = contentWithoutCode.split('\n').reduce((prev, curr) => {
        // Return the previous value should the element be "" instead of adding empty comments
        if (curr === '') return prev;
        return prev.replace(curr, commentify(curr, firstLanguageKey));
      }, pastecordCode);

      const pasteCordURL = await UploadToPastecord(
        pastecordCode,
        firstLanguageKey
      );
      // This is what the bot will send
      let replyContent = `Formatted ${
        languageNameMappings[firstLanguageKey] || 'unspecified'
      } code for <@${
        reaction.message.author.id
      }>, original: ${pasteCordURL}\n${prettifiedCode}`;
      // The max character limit for discord message contents is 2000
      if (replyContent.length > 1999) {
        prettiedPastecordCode = contentWithoutCode
          .split('\n')
          .reduce((prev, curr) => {
            // Return the previous value should the element be "" instead of adding empty comments
            if (curr === '') return prev;
            return prev.replace(curr, commentify(curr, firstLanguageKey));
          }, prettiedPastecordCode);
        // The formatted code to be sent to pastecord
        const prettyPasteCord = await UploadToPastecord(
          prettiedPastecordCode,
          firstLanguageKey
        );
        replyContent = `Formatted code was too large to send through discord\nFormatted Code: ${prettyPasteCord}`;
      }
      reaction.message.channel.send(replyContent);
      if (deleteOriginalMessage) reaction.message.delete();
    } catch (err: unknown) {
      console.log(err);
      reaction.message.react('❌');
    }
  }
});

export { client };
