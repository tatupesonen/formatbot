import { ICommand, COMMAND_TYPE } from '../common/ICommand';

const FormatCommand: ICommand<COMMAND_TYPE.SLASH> = {
  name: 'format',
  type: COMMAND_TYPE.SLASH,
  async execute(interaction) {
    // Parse package.json first
    interaction.reply({ ephemeral: true, content: 'Cool, right? :)' });
  },
};

export default FormatCommand;
