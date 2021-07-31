import discord, { Message } from 'discord.js';
require('discord-reply');
const client = new discord.Client();
import {
  languageMappings,
  languageNameMappings,
} from './formatters/FormatterMappings';
import { UploadToPastecord } from './infra/pastecordintegration';

client.on('ready', () => {
  console.log('Bot ready');
});

const allowed_channels = ['871067756794097724', '871059702027542571'];
const operators = ['121777389012385796'];

let trigger_emoji = '🦆';
let delayed_react = '🕒';

client.on('message', (message) => {
  // Only run in allowed channels
  if (!allowed_channels.includes(message.channel.id)) return;
  if (!operators.includes(message.author.id)) return;

  // User is bot operator
  // Get message args
  const args = message.content.split(' ');
  if (args[0] === '++settrigger' && args[1]) {
    trigger_emoji = args[1];
    message.reply(`Set new trigger to ${trigger_emoji}`);
  }
});

client.on('messageReactionAdd', async (reaction) => {
  const { emoji } = reaction;

  // Only run in allowed channels
  if (!allowed_channels.includes(reaction.message.channel.id)) return;
  if (emoji.name === trigger_emoji) {
    const filter = (reaction) => reaction.emoji.name === trigger_emoji;

    // This piece of code is here just for my testing purposes and does not do anything right now
    reaction.message
      .awaitReactions(filter, { time: 30 })
      .then((collected) => console.log(`Collected ${collected.size} reactions`))
      .catch(console.error);

    const content = reaction.message.content;

    // Look for the language mapping to use
    const codeLanguage = content.split('\n')[0].replace('```', '').trim();
    const languageKey = Object.keys(languageMappings).find(
      (key) => key === codeLanguage
    );

    const code = content
      .split(`\`\`\`${codeLanguage}`)
      .join('')
      .split('```')
      .join('');

    try {
      const formatted = languageMappings[languageKey].format(code);
      const withBackticksAndLanguageCode = reformat(formatted, languageKey);
      const pasteCordURL = await UploadToPastecord(code);
      reaction.message.delete();
      reaction.message.channel.send(
        `Formatted ${languageNameMappings[languageKey]} code for <@${
          reaction.message.author.id
        }>, original: ${
          pasteCordURL + languageKey ? `.${languageKey}` : ''
        } ${withBackticksAndLanguageCode}`
      );
    } catch (err: unknown) {
      console.log(err);
      reaction.message.react('❌');
    }
  }
});

const reformat = (code: string, languageKey): string => {
  return `\`\`\`${languageKey}\n${code}\n\`\`\``;
};

export { client };
