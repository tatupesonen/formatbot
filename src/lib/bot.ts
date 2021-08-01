import discord from 'discord.js';
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
let deleteOriginalMessage = true;

let trigger_emoji = '🦆';
const delayed_react = '⌚';
client.on('message', (message) => {
  // Only run in allowed channels
  if (!allowed_channels.includes(message.channel.id)) return;
  if (!operators.includes(message.author.id)) return;

  // User is bot operator
  // Get message args
  const args = message.content.split(' ');
  if (args[0] === '++settrigger' && args[1]) {
    trigger_emoji = args[1];
    return message.reply(`Set new trigger to ${trigger_emoji}`);
  }
  if (args[0] === '++deleteoriginal') {
    deleteOriginalMessage = !deleteOriginalMessage;
    return deleteOriginalMessage
      ? message.reply(`<@${client.user.id}> will now delete messages.`)
      : message.reply(`<@${client.user.id}> will not delete messages.`);
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
    if (timeInSeconds > 30) return reaction.message.react(delayed_react);
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
      const formatted = await languageMappings[languageKey].format(code);
      const withBackticksAndLanguageCode = reformat(formatted, languageKey);
      const pasteCordURL = await UploadToPastecord(code, languageKey);
      if (deleteOriginalMessage) reaction.message.delete();
      reaction.message.channel.send(
        `Formatted ${languageNameMappings[languageKey]} code for <@${reaction.message.author.id}>, original: ${pasteCordURL} ${withBackticksAndLanguageCode}`
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
