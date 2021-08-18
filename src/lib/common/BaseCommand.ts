import { Interaction, Message } from 'discord.js';

export abstract class BaseCommand implements ICommand {
  abstract name: string;
  abstract execute: (
    interaction: Interaction | Message
  ) => void | Promise<void>;
}

export interface ICommand {
  name: string;
  execute: (interaction: Interaction | Message) => void | Promise<void>;
}
