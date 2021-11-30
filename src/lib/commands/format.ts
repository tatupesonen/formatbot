import { InteractionReplyOptions } from 'discord.js';
import { DITypes } from '../container/container';
import { FormatService } from '../service/FormatService';
import { createCommand } from '../util/createCommand';

export default createCommand({
  name: 'Format',
  description: '',
  type: 'CHAT_INPUT',
  async execute(interaction, container) {
    // Get service
    const service = container.getByKey<FormatService>(DITypes.formatService);
    const baseReply: InteractionReplyOptions = { ephemeral: true };
    await interaction.deferReply(baseReply);
    // Parse package.json first
    try {
      const message = await interaction.channel.messages.fetch(
        interaction.user.id
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
});
