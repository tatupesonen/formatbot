import { Client } from 'discord.js';
import { reformat } from './util/reformatter';
import {
  languageMappings,
  languageNameMappings,
} from './formatters/FormatterMappings';
import { UploadToPastecord } from './infra/pastecordintegration';
import { asyncStringReplacer, commentify } from './util/utils';
import { readdirSync } from 'fs';
import { COMMAND_TYPE, ICommand } from './common/ICommand';
import { StatusCommand } from './commands/status';

const COMMANDS: Map<string, ICommand<COMMAND_TYPE>> = new Map();

// Let's load all the commands.
const commandFiles = readdirSync('./src/lib/commands');
commandFiles.forEach(async (item) => {
  const command: ICommand<COMMAND_TYPE> = await import(`./commands/${item}`);
  COMMANDS.set(command.name, command);
});

//? The required intents for "messageCreate" and "messageReactionAdd". Events currently listened to
const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
});
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

client.on('message', async (interaction) => {
  if (interaction.content.startsWith('format!status')) {
    StatusCommand.execute(interaction);
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
      // The amount of code blocks in the content
      let codeBlockCounter = 0;
      // The amount of code blocks that weren't formattable
      let unformattableCodeBlockCounter = 0;

      const prettifiedCode = await asyncStringReplacer(
        content,
        /```([^`\n]*)((?:(?:(?!```).)|\n)*)```/g,
        async (
          match,
          _offset,
          _completeString,
          _groups,
          language,
          codeContent
        ) => {
          codeBlockCounter++;
          // For empty code blocks or one liner code blocks
          if (!codeContent.trim()) {
            // For one liners
            if (language.trim() && !languageMappings[language]) {
              unformattableCodeBlockCounter++;
              return match;
            }
            // For empty codeblocks, remove the content
            unformattableCodeBlockCounter++;
            return '';
          }
          // If firstLanguage is undefined and language is a valid languagekey, it sets the value
          if (!firstLanguageKey && languageNameMappings[language])
            firstLanguageKey = language.trim();
          const theCode = codeContent.trim();
          // Remove the entire code block
          contentWithoutCode = contentWithoutCode.replace(match, '\n');
          // Remove the code block formatting and adds it's content
          pastecordCode = pastecordCode.replace(
            match,
            '\n' + codeContent + '\n'
          );
          const languageFormatter = languageMappings[language];
          // If "language" is undefined or unsupported for formatting, return the original code block with it's content
          if (!languageFormatter) {
            unformattableCodeBlockCounter++;
            return match;
          }
          // Format the code, if it's unformattable, return null
          const formattedCode = await languageFormatter
            .format(theCode)
            .then((code) => code.trim())
            .catch(() => null);
          prettiedPastecordCode = prettiedPastecordCode.replace(
            match,
            '\n' +
              (formattedCode ??
                commentify('Could not format this snippet\n', language) +
                  codeContent) +
              '\n'
          );
          if (!formattedCode) {
            unformattableCodeBlockCounter++;
            return reformat(
              commentify('Could not format this snippet', language) +
                codeContent,
              language
            );
          }
          //Replace the string's code with the formatted code inside a code block
          return match.replace(theCode, formattedCode);
        }
      );
      if (!prettifiedCode) {
        throw new Error("This doesn't have any code blocks");
      }
      // If all the codeblocks were unformattable, cancel
      if (unformattableCodeBlockCounter === codeBlockCounter)
        throw new Error('No Formattable code block');

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
