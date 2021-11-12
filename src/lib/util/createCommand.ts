import { COMMAND_TYPE, Command } from '../interfaces/ICommand';

export const createCommand = <
  TCommandType extends typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE],
  TArgs = void
>(
  cmd: Command<TCommandType, TArgs>
) => {
  return cmd;
};
