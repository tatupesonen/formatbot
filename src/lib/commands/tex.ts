import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';
import { DITypes } from '../container/container';
import { LaTeXService } from '../service/LaTeXService';
import { createCommand } from '../util/createCommand';

const LaTeXCommand = createCommand({
  name: 'tex',
  type: ApplicationCommandType.ChatInput,
  description: 'Formats LaTeX',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      required: true,
      description: 'LaTeX to convert into an image.',
      name: 'content',
    },
  ],
  async execute(interaction, container) {
    const service = container.getByKey<LaTeXService>(DITypes.latexService);
    await interaction.deferReply();
    try {
      const content = interaction.options.getString('content');
      if (content.length > 200) {
        interaction.editReply({
          content:
            'Content exceeds 200 characters, unable to convert. Content has ' +
            content.length +
            ' characters.',
        });
        return;
      }
      const url = await service.format(content);
      if (content) {
        interaction.editReply({
          content: url,
        });
      }
    } catch (err) {
      interaction.editReply({
        content: "Hey, you didn't send any tex to convert! :(",
      });
    }
  },
});

export default LaTeXCommand;
