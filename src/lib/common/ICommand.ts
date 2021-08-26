import { CommandInteraction, Message } from 'discord.js';
export interface ICommand<T extends keyof typeof COMMAND_TYPE> {
  name: string;
  // Later used for filtering based on the command type
  type: T;
  execute(
    interaction: T extends COMMAND_TYPE.MESSAGE ? Message : CommandInteraction,
    args?: string[]
  ): void;
}

export enum COMMAND_TYPE {
  DEFERRED = 'DEFERRED',
  SLASH = 'SLASH',
  MESSAGE = 'MESSAGE',
  CONTEXTMENU = 'CONTEXTMENU',
}
