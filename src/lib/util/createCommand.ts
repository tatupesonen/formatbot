import { COMMAND_TYPE, Command } from '../interfaces/ICommand';

export const createCommand = <T extends COMMAND_TYPE>(cmd: Command<T>) => {
  return cmd;
};
