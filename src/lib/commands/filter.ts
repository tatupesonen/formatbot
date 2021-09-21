import { InteractionReplyOptions } from 'discord.js';
import { COMMAND_TYPE, ICommand } from '../interfaces/ICommand';

const FilterCommand: ICommand<COMMAND_TYPE.CHANNEL> = {
  name: 'filter',
  type: COMMAND_TYPE.CHANNEL,
  description: 'Gets a regex/string from the user and finds all the matches.',
  options: [
    {
      type: 'STRING',
      name: 'messageid',
      description: 'ID of the message to filter.',
      required: true,
    },
    {
      type: 'STRING',
      description: 'Regex / search string to use when filtering.',
      name: 'regex',
      required: true,
    },
  ],
  async execute(interaction) {
    // Get service
    const baseReply: InteractionReplyOptions = { ephemeral: true };
    await interaction.deferReply(baseReply);
    // Parse package.json first
    try {
      const targetMessage = interaction.options.getString('messageid');
      const regex = interaction.options.getString('regex');
      if (!regex)
        return interaction.editReply({
          ...baseReply,
          content: 'No regex / search string.',
        });
      interaction.editReply({ ...baseReply, content: targetMessage });
    } catch (err) {
      interaction.editReply({
        ...baseReply,
        content: err.message,
      });
    }
  },
};

export default FilterCommand;
