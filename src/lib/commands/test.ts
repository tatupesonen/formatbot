import { ICommand, COMMAND_TYPE } from '../common/ICommand';
const TestCommand: ICommand<COMMAND_TYPE.MESSAGE> = {
  name: 'test',
  type: COMMAND_TYPE.MESSAGE,
  async execute(interaction) {
    interaction.reply('dynamically loaded');
  },
};

export default TestCommand;
