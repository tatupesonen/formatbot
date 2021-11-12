import { MessageEmbed } from 'discord.js';
import { Command, COMMAND_TYPE } from '../interfaces/ICommand';

const HelpCommand: Command<COMMAND_TYPE.LEGACY> = {
  name: 'help',
  description: 'Shows help information',
  type: COMMAND_TYPE.LEGACY,
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
};

export default HelpCommand;
