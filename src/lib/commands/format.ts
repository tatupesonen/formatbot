import { InteractionReplyOptions } from 'discord.js';
import { DITypes } from '../container/container';
import { ICommand, COMMAND_TYPE } from '../interfaces/ICommand';
import { FormatService } from '../service/FormatService';

const FormatCommand: ICommand<COMMAND_TYPE.SLASH> = {
  name: 'Format',
  description: '',
  type: COMMAND_TYPE.SLASH,
  async execute(interaction, container) {
    // Get service
    const service = container.getByKey<FormatService>(DITypes.formatService);
    const baseReply: InteractionReplyOptions = { ephemeral: true };
    await interaction.deferReply(baseReply);
    // Parse package.json first
    try {
      const message = await interaction.channel.messages.fetch(
        interaction.targetId
      );
      const formatted = await service.format(message.toString());
      interaction.editReply({ ...baseReply, content: formatted });
    } catch (err) {
      interaction.editReply({
        ...baseReply,
        content: err.message,
      });
    }
  },
};

export default FormatCommand;
