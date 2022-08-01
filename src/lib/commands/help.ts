import { MessageEmbed } from 'discord.js';
import { createCommand } from '../util/createCommand';

export default createCommand({
  name: 'help',
  description: 'Shows help information',
  type: 'LEGACY',
  async execute(message) {
    const embed: Partial<MessageEmbed> = {
      fields: [
        {
          inline: false,
          name: 'Help',
          value:
            'To use FormatBot, you simply right-click on a message that contains a code block that has been annotated with a language.',
        },
        {
          inline: false,
          name: 'Need more help?',
          value:
            'Join the support server for more questions. Link to the support server is on the top.gg page.',
        },
      ],
    };
    message.reply({ embeds: [embed] });
  },
});
