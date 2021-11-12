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

// This type alias is necessary because `unknown | void`
// will either not satisfy command or event expected return types, `any` can also not be added inline
// because of conflicting prettier and eslint rules
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CommandReturnType = any;

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
    ...args: [...args: Mapped<TArgs>[TCommandType], container: Container]
  ): Awaited<CommandReturnType>;
  // eslint-disable-next-line @typescript-eslint/ban-types
} & (TArgs extends void ? {} : ICommandWithArgs<TArgs>);

export enum COMMAND_TYPE {
  LEGACY = 'LEGACY',
  SLASH = 'MESSAGE',
  CHANNEL = 'CHAT_INPUT',
}

export interface CommandOption extends CommandInteractionOption {
  required?: boolean;
  description: string;
}

interface Mapped<TArgs> {
  [COMMAND_TYPE.CHANNEL]: [interaction: CommandInteraction];
  [COMMAND_TYPE.SLASH]: [interaction: ContextMenuInteraction];
  [COMMAND_TYPE.LEGACY]: [message: Message, ...args: ArgsType<TArgs>];
}
