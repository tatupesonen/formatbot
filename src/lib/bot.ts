import { Client, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { COMMAND_TYPE, ICommand } from './common/ICommand';
import StatusCommand from './commands/status';

export const COMMANDS: Record<string, ICommand<COMMAND_TYPE>> = {};

// Let's load all the commands.
const commandFiles = readdirSync('./src/lib/commands');
commandFiles.forEach(async (item) => {
  const command = await import(`./commands/${item}`);
  COMMANDS[command.default.name] = command.default;
  console.log('Imported command ' + command.default.name);
});

const guildId = '871059702027542568';

//? The required intents for "messageCreate" and "messageReactionAdd". Events currently listened to
const client = new Client({
  intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
  allowedMentions: { repliedUser: true },
});
client.on('ready', async () => {
  // Register Context Menu commands
  console.log('Bot ready');
});

const allowed_channels = ['871067756794097724', '871059702027542571'];
let prefix = 'format!';

client.on('guildCreate', async (guild) => {
  console.log('Joined a new guild! ' + guild.id);
});

client.on('messageCreate', (message) => {
  if (!allowed_channels.includes(message.channel.id) || message.author.bot)
    return;
  // Special case for bot mentions
  if (
    message.mentions.has(client.user, {
      ignoreEveryone: true,
      ignoreRoles: true,
    }) &&
    message.content.trim().length === client.user.id.length + 4
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
      console.log(`User ran command ${interaction.commandName}`);
    }
  }
});

export { client };
