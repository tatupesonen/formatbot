import { ApplicationCommandData } from 'discord.js';
import { client, COMMANDS } from '../bot';
import { ICommand, COMMAND_TYPE } from '../common/ICommand';

const FormatCommand: ICommand<COMMAND_TYPE.CHANNEL> = {
  name: 'deploy',
  description: "Deploys the bot's slash commands and context menus",
  type: COMMAND_TYPE.CHANNEL,
  async execute(interaction) {
    if (interaction.author.id !== '121777389012385796') return;
    const slashCommands: ApplicationCommandData[] = Object.entries(COMMANDS)
      .filter(([_, value]) => value.type === COMMAND_TYPE.SLASH)
      .reduce((acc, cur) => {
        acc.push(cur[1]);
        return acc;
      }, []);
    await client.application.commands.set(slashCommands);
    interaction.reply(`Registered ${slashCommands.length} commands.`);
  },
};

export default FormatCommand;
