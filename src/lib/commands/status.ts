import { MessageEmbed } from 'discord.js';
import { ICommand, COMMAND_TYPE } from '../common/ICommand';

export const StatusCommand: ICommand<COMMAND_TYPE.MESSAGE> = {
  name: 'status',
  type: COMMAND_TYPE.MESSAGE,
  async execute(interaction) {
    // Parse package.json first
    const pjson = require('../../../package.json');
    const versions = Object.entries(pjson.dependencies);

    // Get the git HEAD.
    let revision;
    try {
      revision = require('child_process')
        .execSync('git rev-parse HEAD')
        .toString()
        .trim();
    } catch (err: any) {
      console.log("Couldn't execute using child process");
    }

    const embed: Partial<MessageEmbed> = {
      title: 'FormatBot',
      description: `Git branch revision: ${revision ?? 'unavailable'}`,
      fields: [
        {
          name: 'Versions',
          value: versions.reduce((acc, [key, value]) => {
            acc += `${key}: ${value}\n`;
            return acc;
          }, ''),
          inline: false,
        },
      ],
    };
    interaction.reply({ embeds: [embed] });
  },
};
