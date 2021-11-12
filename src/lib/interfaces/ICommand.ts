import {
  Awaited,
  CommandInteraction,
  CommandInteractionOption,
  ContextMenuInteraction,
  Message,
} from 'discord.js';
import { Container } from '../container/container';

type ArgsType<T> = T extends Array<infer U>
  ? U extends void
    ? []
    : U extends unknown
    ? [string[]]
    : [T]
  : [];

// These type alias are necessary because inline declarations
// clash between prettier and eslint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CommandReturnType = any;

// eslint-disable-next-line @typescript-eslint/ban-types
type EmptyObject = {};

interface ICommandWithArgs<TArgs> {
  resolveArgs(message: Message, args: string[]): Promise<TArgs>;
}

export type Command<
  TCommandType extends typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE],
  TArgs = void
> = {
  name: string;
  description: string;
  type: TCommandType;
  options?: CommandOption[];
  execute(
    ...args: [...args: IMapped<TArgs>[TCommandType], container: Container]
  ): Awaited<CommandReturnType>;
} & (TArgs extends void
  ? EmptyObject
  : TCommandType extends COMMAND_TYPE.LEGACY
  ? ICommandWithArgs<TArgs>
  : EmptyObject);

export enum COMMAND_TYPE {
  LEGACY = 'LEGACY',
  SLASH = 'MESSAGE',
  CHANNEL = 'CHAT_INPUT',
}

export interface CommandOption extends CommandInteractionOption {
  required?: boolean;
  description: string;
}

interface IMapped<TArgs> {
  [COMMAND_TYPE.CHANNEL]: [interaction: CommandInteraction];
  [COMMAND_TYPE.SLASH]: [interaction: ContextMenuInteraction];
  [COMMAND_TYPE.LEGACY]: [message: Message, ...args: ArgsType<TArgs>];
}
