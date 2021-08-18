import { Interaction, Message } from 'discord.js';
import { BaseCommand, ICommand } from '../common/BaseCommand';

export class StatusCommand implements BaseCommand, ICommand {
  name: 'status';
  async execute(interaction: Interaction | Message) {
    // We only care about Messages now now
    if (interaction instanceof Message) {
      interaction.reply('test');
    }
  }
}
