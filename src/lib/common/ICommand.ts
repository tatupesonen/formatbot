import { CommandInteraction, Message } from 'discord.js';
export interface ICommand<
  T extends typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE]
> {
  name: string;
  description: string;
  type: T;
  execute(
    interaction: T extends COMMAND_TYPE.CHANNEL ? Message : CommandInteraction,
    args?: string[]
  ): void;
}

export enum COMMAND_TYPE {
  SLASH = 'MESSAGE',
  CHANNEL = 'CHAT',
}
