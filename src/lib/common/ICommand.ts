import {
  CommandInteraction,
  ContextMenuInteraction,
  Message,
} from 'discord.js';
export interface ICommand<
  T extends typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE]
> {
  name: string;
  description: string;
  type: T;
  execute(interaction: interactionTypeMapper[T], args?: string[]): void;
}

export enum COMMAND_TYPE {
  LEGACY = 'LEGACY',
  SLASH = 'MESSAGE',
  CHANNEL = 'CHAT_INPUT',
}
interface interactionTypeMapper {
  MESSAGE: ContextMenuInteraction;
  CHAT_INPUT: CommandInteraction;
  LEGACY: Message;
}
