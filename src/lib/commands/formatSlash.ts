import { InteractionReplyOptions } from 'discord.js';
import { DITypes } from '../container/container';
import { languageMappings } from '../formatters/FormatterMappings';
import { COMMAND_TYPE, ICommand } from '../interfaces/ICommand';
import { FormatService } from '../service/FormatService';

const FormatSlashCommand: ICommand<COMMAND_TYPE.CHANNEL> = {
  name: 'format',
  type: COMMAND_TYPE.CHANNEL,
  description: "Formats a message that's given as an argument",
  options: [
    {
      type: 'STRING',
      name: 'messageid',
      description: 'ID of the message to format.',
      required: true,
    },
    {
      type: 'STRING',
      description:
        'Language to use for formatting (eg. js, python). If not supplied, language will be detected.',
      name: 'programminglanguage',
    },
  ],
  async execute(interaction, container) {
    // Get service
    const service = container.getByKey<FormatService>(DITypes.formatService);
    const baseReply: InteractionReplyOptions = { ephemeral: true };
    await interaction.deferReply(baseReply);
    // Parse package.json first
    try {
      const targetMessage = interaction.options.getString('messageid');
      const userInputLanguage = interaction.options.getString(
        'programminglanguage'
      );
      if (userInputLanguage)
        return interaction.editReply({
          ...baseReply,
          content:
            'Congratulations, you found a currently unused feature! This will be implemented later.\nIn the meanwhile, use the /format command without specifying the programming language.',
        });
      // if (
      //   userInputLanguage &&
      //   !Object.keys(languageMappings).some(
      //     (key) => key.toLowerCase() === userInputLanguage.toLowerCase()
      //   )
      // )
      //   return interaction.editReply({
      //     ...baseReply,
      //     content:
      //       "Sorry, I don't support the programming language you gave to me. Yet :)",
      //   });
      // Check that inputlanguage is in
      let message;
      try {
        message = await interaction.channel.messages.fetch(targetMessage);
      } catch (err) {
        throw new Error(
          "Couldn't find a message with given snowflake. Maybe you gave me the wrong ID?"
        );
      }
      const formatted = await service.format(
        message.toString(),
        userInputLanguage as unknown as keyof typeof languageMappings
      );
      interaction.editReply({ ...baseReply, content: formatted });
    } catch (err) {
      interaction.editReply({
        ...baseReply,
        content: err.message,
      });
    }
  },
};

export default FormatSlashCommand;
