import { Client } from 'discord.js';
import { COMMANDS } from '../bot';
import { ContextMenuCommand, SlashCommand } from '../interfaces/ICommand';
import { createCommand } from '../util/createCommand';

export default createCommand({
  name: 'deploy',
  description: "Deploys the bot's slash commands and context menus",
  type: 'LEGACY',
  async execute(message, _args, container) {
    // Get dependencies
    const client = container.getByKey<Client>('client');
    if (message.author.id !== process.env.OWNER) return;

    const nonLegacyCommands = Object.values(COMMANDS).filter(
      (command): command is ContextMenuCommand | SlashCommand =>
        command.type !== 'LEGACY'
    );

    await client.application.commands.set(nonLegacyCommands);
    message.reply(`Registered ${nonLegacyCommands.length} commands.`);
  },
});
