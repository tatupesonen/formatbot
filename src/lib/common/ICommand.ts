import { ContextMenuInteraction, Message } from 'discord.js';
export interface ICommand<
  T extends typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE]
> {
  name: string;
  description: string;
  type: T;
  execute(
    interaction: T extends COMMAND_TYPE.CHANNEL
      ? Message
      : ContextMenuInteraction,
    args?: string[]
  ): void;
}

export enum COMMAND_TYPE {
  NORMAL = 'NORMAL',
  SLASH = 'MESSAGE',
  CHANNEL = 'CHAT_INPUT',
}
