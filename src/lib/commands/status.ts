import { MessageEmbed } from 'discord.js';
import { client } from '../bot';
import { ICommand, COMMAND_TYPE } from '../common/ICommand';

const StatusCommand: ICommand<COMMAND_TYPE.MESSAGE> = {
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

    // Get the bot's ping to the guild
    const ping = client.guilds.cache.find(
      (guild) => guild.id === interaction.guildId
    ).shard.ping;

    const embed: Partial<MessageEmbed> = {
      url: pjson.repository,
      author: {
        name: 'FormatBot',
        iconURL: client.user.displayAvatarURL(),
        url: pjson.repository,
      },
      title: 'FormatBot',
      color: 0xfc9003,
      description: `FormatBot is a utility bot designed for formatting code blocks on Discord.`,
      fields: [
        {
          name: 'Info',
          value: `Git branch revision: ${revision ?? 'unavailable'}
      Repository: ${pjson.repository ?? 'unavailable'}
      Ping: ${ping ?? 'unavailable'}`,
          inline: false,
        },
        {
          name: 'Library versions',
          value: `\`\`\`${versions.reduce((acc, [key, value]) => {
            acc += `${key}: ${value}\n`;
            return acc;
          }, '')}\`\`\``,
          inline: false,
        },
      ],
    };
    interaction.reply({ embeds: [embed] });
  },
};

export default StatusCommand;
