import discord from 'discord.js';
require('discord-reply');
const client = new discord.Client();
import {
  languageMappings,
  languageNameMappings,
} from './formatters/FormatterMappings';

client.on('ready', () => {
  console.log('Bot ready');
});

const allowed_channels = ['871067756794097724', '871059702027542571'];
const trigger_emoji = '🦆';

client.on('messageReactionAdd', (reaction) => {
  const { emoji } = reaction;

  // Only run in allowed channels
  if (!allowed_channels.includes(reaction.message.channel.id)) return;

  if (emoji.name === trigger_emoji) {
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
      reaction.message.delete();
      reaction.message.channel.send(
        `Formatted ${languageNameMappings[languageKey]} code for <@${reaction.message.author.id}>:${withBackticksAndLanguageCode}`
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
