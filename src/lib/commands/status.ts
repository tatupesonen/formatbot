import { intervalToDuration } from 'date-fns';
import { MessageEmbed } from 'discord.js';
import { client } from '../bot';
import { ICommand, COMMAND_TYPE } from '../common/ICommand';

const StatusCommand: ICommand<COMMAND_TYPE.CHANNEL> = {
  name: 'status',
  description: "Shows FormatBot's status",
  type: COMMAND_TYPE.CHANNEL,
  async execute(interaction) {
    // Parse package.json first
    const pjson = require(`${__dirname}/../../../package.json`);
    const versions = Object.entries(pjson.dependencies);

    // Get uptime
    const uptimeUnits = intervalToDuration({
      start: new Date().getTime() - client.uptime,
      end: new Date().getTime(),
    });

    // Find dev user
    const developer = await client.users.fetch('121777389012385796');

    const embed: Partial<MessageEmbed> = {
      url: pjson.repository,
      author: {
        name: developer.tag,
        iconURL: developer.avatarURL(),
        url: pjson.repository,
      },
      thumbnail: {
        url: client.user.displayAvatarURL(),
      },
      title: 'FormatBot',
      color: 0xfc9003,
      description: `FormatBot is a utility bot designed for formatting code blocks on Discord.`,
      fields: [
        {
          name: 'Info',
          value: `Repository: ${pjson.repository ?? 'unavailable'}
      WebSocket latency: ${client.ws.ping + 'ms' ?? 'unavailable'}`,
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
        {
          name: 'Uptime',
          value: `${uptimeUnits.months} months, ${uptimeUnits.days} days, ${uptimeUnits.hours} hours, ${uptimeUnits.minutes} minutes, ${uptimeUnits.seconds} seconds`,
          inline: false,
        },
        {
          name: 'Feedback',
          value: `Got suggestions / feedback? Contact narigon#0001 or file an [issue](${createIssueLink(
            pjson.repository
          )}) on the GitHub repository.`,
          inline: false,
        },
      ],
    };
    interaction.reply({ embeds: [embed] });
  },
};

const createIssueLink = (url: string) => `${url}/issues/new`;

export default StatusCommand;
