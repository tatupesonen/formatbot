import { Client, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { COMMAND_TYPE, ICommand } from './common/ICommand';
import StatusCommand from './commands/status';

export const COMMANDS: Record<string, ICommand<COMMAND_TYPE>> = {};

// Let's load all the commands.
const commandFiles = readdirSync(`${__dirname}/commands`);
commandFiles.forEach(async (item) => {
  const command = await require(`./commands/${item}`);
  COMMANDS[command.default.name] = command.default;
  console.log('Imported command ' + command.default.name);
});

//? The required intents for "messageCreate" and "messageReactionAdd". Events currently listened to
const client = new Client({
  intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
  allowedMentions: { repliedUser: true },
  partials: ['CHANNEL'],
});
client.on('ready', async () => {
  // Set presence

  console.log('Bot ready');
});

let prefix = 'format!';

client.on('guildCreate', async (guild) => {
  console.log(`Joined a new guild! ${guild.name}, ${guild.id}`);
});

client.on('guildDelete', async (guild) => {
  console.warn(`Removed from guild! ${guild.name}, ${guild.id}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  // Special case for bot mentions
  if (
    message.mentions.has(client.user, {
      ignoreEveryone: true,
      ignoreRoles: true,
    }) &&
    message.content.trim().length <= client.user.id.length + 4
  ) {
    StatusCommand.execute(message);
  }
  if (!message.content.startsWith(prefix)) return;
  // User is bot operator
  // Get message args
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const [command, ...commandArgs] = args;
  // Find command from args and run execute
  if (COMMANDS[command]) {
    COMMANDS[command].execute(message, commandArgs);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isContextMenu()) {
    if (COMMANDS[interaction.commandName]) {
      COMMANDS[interaction.commandName].execute(interaction);
      console.log(
        `${interaction.user.username}: ${interaction.user.id} ran command ${interaction.commandName}`
      );
    }
  }
});

export { client };
