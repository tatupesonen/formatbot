import { COMMAND_TYPE, ICommand } from '../interfaces/ICommand';

export const createCommand = <T extends COMMAND_TYPE>(cmd: ICommand<T>) => {
  return cmd;
};
