import { ApplicationCommandType, MessageFlags } from 'discord.js';
import { DITypes } from '../container/container';
import { FormatService } from '../service/FormatService';
import { createCommand } from '../util/createCommand';

export default createCommand({
  name: 'Format',
  type: ApplicationCommandType.Message,
  async execute(interaction, container) {
    // Get service
    const service = container.getByKey<FormatService>(DITypes.formatService);
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    // Parse package.json first
    try {
      const message = await interaction.channel.messages.fetch(
        interaction.targetId
      );
      const formatted = await service.format(message.toString());
      interaction.editReply({ content: formatted });
    } catch (err) {
      interaction.editReply({
        content: err.message,
      });
    }
  },
});
