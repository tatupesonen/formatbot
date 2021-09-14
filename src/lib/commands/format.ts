import { InteractionReplyOptions } from 'discord.js';
import { DITypes } from '../container/container';
import {
  languageMappings,
  languageNameMappings,
} from '../formatters/FormatterMappings';
import { ICommand, COMMAND_TYPE } from '../interfaces/ICommand';
import { IDetector } from '../interfaces/IDetector';
import { IParser } from '../interfaces/IParser';
import { reformat } from '../util/reformatter';
import { checkIfLanguageSupported, commentify } from '../util/utils';

const FormatCommand: ICommand<COMMAND_TYPE.SLASH> = {
  name: 'Format',
  description: '',
  type: COMMAND_TYPE.SLASH,
  async execute(interaction, container) {
    // Get parser
    const parser = container.getByKey<IParser>(DITypes.parser);
    const detector = container.getByKey<IDetector>(DITypes.detector);
    const baseReply: InteractionReplyOptions = { ephemeral: true };
    await interaction.deferReply(baseReply);
    // Parse package.json first
    try {
      const message = await interaction.channel.messages.fetch(
        interaction.targetId
      );
      const blocks = parser.parseMessage(message.toString());
      // Find formatter and try to format
      const formattedBlocks = await Promise.all(
        blocks.map(async (block) => {
          let formattedBlock;
          let detectedLanguageKey;
          if (block.languageKey) {
            console.log(block.languageKey);
            try {
              formattedBlock = await languageMappings[block.languageKey].format(
                block.content
              );
            } catch (err) {
              const comment = commentify(
                `Couldn't format this ${
                  languageNameMappings[block.languageKey]
                } snippet. Perhaps there's a syntax error?`,
                block.languageKey
              );
              formattedBlock = `${comment}\n${block.content}`;
            }
          } else {
            // Attempt detecting the language
            const { langKey, fullLangName } = await detector.detect(
              block.content
            );
            detectedLanguageKey = langKey;
            if (detectedLanguageKey) {
              // One last attempt at formatting
              // Check if the language is supported
              const isSupported = checkIfLanguageSupported(detectedLanguageKey);
              if (isSupported) {
                try {
                  formattedBlock = await languageMappings[
                    detectedLanguageKey
                  ].format(block.content);
                } catch (err) {
                  const comment = commentify(
                    `Couldn't format this snippet. Perhaps there's a syntax error, or maybe the detector made a mistake?${
                      fullLangName
                        ? ` Detected language: ${
                            languageNameMappings[detectedLanguageKey]
                              ? languageNameMappings[detectedLanguageKey]
                              : fullLangName
                          }`
                        : ''
                    }`
                  );
                  // Formatting failed, set detectedLanguageKey to null.
                  detectedLanguageKey = null;
                  formattedBlock = `${comment}\n${block.content}`;
                }
              }
            } else {
              const comment = commentify(
                `Couldn't find a compatible formatter for this code block. ${
                  fullLangName
                    ? `detected language: ${
                        languageNameMappings[detectedLanguageKey]
                          ? languageNameMappings[detectedLanguageKey]
                          : fullLangName
                      }`
                    : "Couldn't detect a language."
                }`
              );
              formattedBlock = `${comment}\n${block.content}`;
            }
          }
          let reformatLangKey = block.languageKey
            ? block.languageKey
            : detectedLanguageKey;
          reformatLangKey ??= '';
          console.log(block.languageKey, detectedLanguageKey, reformatLangKey);
          return reformat(formattedBlock, reformatLangKey);
        })
      );
      const reply = formattedBlocks.join('');
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
