import { ICommand, COMMAND_TYPE } from '../common/ICommand';

export const StatusCommand: ICommand<COMMAND_TYPE.MESSAGE> = {
  name: 'status',
  type: COMMAND_TYPE.MESSAGE,
  execute(interaction) {
    // properly typed as Message automatically
  },
};
