import { InteractionReplyOptions } from 'discord.js';
import { DITypes } from '../container/container';
import { COMMAND_TYPE } from '../interfaces/ICommand';
import { LaTeXService } from '../service/LaTeXService';
import { createCommand } from '../util/createCommand';

const LaTeXCommand = createCommand({
  name: 'tex',
  type: COMMAND_TYPE.CHANNEL,
  description: 'Formats LaTeX',
  options: [
    {
      type: 'STRING',
      required: true,
      description: 'LaTeX to convert into an image.',
      name: 'content',
    },
  ],
  async execute(interaction, container) {
    const service = container.getByKey<LaTeXService>(DITypes.latexService);
    const baseReply: InteractionReplyOptions = { ephemeral: false };
    await interaction.deferReply(baseReply);
    try {
      const content = interaction.options.getString('content');
      const url = await service.format(content);
      if (content) {
        interaction.editReply({
          ...baseReply,
          content: url,
        });
      }
    } catch (err) {
      interaction.editReply({
        ...baseReply,
        content: "Hey, you didn't send any tex to convert! :(",
      });
    }
  },
});

export default LaTeXCommand;
