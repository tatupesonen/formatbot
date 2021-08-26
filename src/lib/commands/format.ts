import { ContextMenuInteraction, InteractionReplyOptions } from 'discord.js';
import { ICommand, COMMAND_TYPE } from '../common/ICommand';
import { formatMessage } from '../util/FormatMessage';

const FormatCommand: ICommand<COMMAND_TYPE.SLASH> = {
  name: 'Format',
  description: '',
  type: COMMAND_TYPE.SLASH,
  async execute(interaction) {
    const baseReply: InteractionReplyOptions = { ephemeral: true };
    await interaction.deferReply(baseReply);
    // Parse package.json first
    const message = await interaction.channel.messages.fetch(
      (interaction as ContextMenuInteraction).targetId
    );
    try {
      const reply = await formatMessage(message);
      interaction.editReply({ ...baseReply, content: reply });
    } catch {
      interaction.editReply({
        ...baseReply,
        content: "Couldn't find any code snippets in the message.",
      });
    }
  },
};

export default FormatCommand;
