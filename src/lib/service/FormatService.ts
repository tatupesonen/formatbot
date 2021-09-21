import { Container, DITypes } from '../container/container';
import {
  languageMappings,
  languageNameMappings,
} from '../formatters/FormatterMappings';
import { IDetector } from '../interfaces/IDetector';
import { IParser } from '../interfaces/IParser';
import { logger } from '../util/logger';
import { reformat } from '../util/reformatter';
import { checkIfLanguageSupported, commentify } from '../util/utils';

export class FormatService {
  constructor(private readonly container: Container) {}

  public async format(
    message: string,
    _languageKey?: keyof typeof languageMappings
  ): Promise<string> {
    const parser = this.container.getByKey<IParser>(DITypes.parser);
    const detector = this.container.getByKey<IDetector>(DITypes.detector);

    const blocks = parser.parseMessage(message);
    if (blocks.length === 0)
      return "Couldn't find any code blocks in this message.";

    // Find formatter and try to format
    const formattedBlocks = await Promise.all(
      blocks.map(async (block) => {
        let formattedBlock;
        let detectedLanguageKey;
        if (block.languageKey) {
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
            logger.info(
              `Detected ${detectedLanguageKey} for a block with no language key.`
            );
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
        let reformatLangKey;
        console.log(block.languageKey, detectedLanguageKey);
        // Order in which to pick the key to use
        reformatLangKey ??= block.languageKey;
        reformatLangKey ??= detectedLanguageKey;
        reformatLangKey ??= '' as keyof typeof languageMappings;
        return reformat(formattedBlock, reformatLangKey);
      })
    );
    const reply = formattedBlocks.join('');
    return reply;
  }
}
