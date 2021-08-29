import { InteractionReplyOptions } from 'discord.js';
import { ICommand, COMMAND_TYPE } from '../common/ICommand';
import { formatMessage } from '../util/FormatMessage';

const FormatCommand: ICommand<COMMAND_TYPE.SLASH> = {
  name: 'Format',
  description: '',
  type: COMMAND_TYPE.SLASH,
  async execute(interaction, container) {
    // Fix crash in DM
    const baseReply: InteractionReplyOptions = { ephemeral: true };
    await interaction.deferReply(baseReply);
    // Parse package.json first
    try {
      const message = await interaction.channel.messages.fetch(
        interaction.targetId
      );
      const reply = await formatMessage(message, container);
      interaction.editReply({ ...baseReply, content: reply });
    } catch (err) {
      interaction.editReply({
        ...baseReply,
        content: err.message,
      });
    }
  },
};

export default FormatCommand;
