import { Client, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { COMMAND_TYPE, ICommand } from './interfaces/ICommand';
import StatusCommand from './commands/status';
import { Container } from './container/container';
import { logger } from './util/logger';

export const COMMANDS: Record<string, ICommand<COMMAND_TYPE>> = {};
export const createBot = async (container: Container) => {
  // Let's load all the commands.
  const commandFiles = readdirSync(`${__dirname}/commands`);
  commandFiles.forEach(async (item) => {
    const command = await require(`./commands/${item}`);
    COMMANDS[command.default.name] = command.default;
    logger.verbose('Imported command ' + command.default.name);
  });

  //? The required intents for "messageCreate" and "messageReactionAdd". Events currently listened to
  const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
    allowedMentions: { repliedUser: true },
    partials: ['CHANNEL'],
  });
  client.on('ready', async () => {
    logger.info('Bot ready');
  });

  const prefix = 'format!';

  client.on('guildCreate', async (guild) => {
    logger.info(`Joined a new guild! ${guild.name}, ${guild.id}`);
  });

  client.on('guildDelete', async (guild) => {
    logger.warn(`Removed from guild! ${guild.name}, ${guild.id}`);
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
      StatusCommand.execute(message, container);
    }
    if (!message.content.startsWith(prefix)) return;
    // User is bot operator
    // Get message args
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const [command, ...commandArgs] = args;
    // Find command from args and run execute
    if (COMMANDS[command]) {
      return COMMANDS[command].execute(message, container, commandArgs);
    }
    logger.warn(
      `${message.author.username}: [${message.author.id}] tried to run nonexistent command ${prefix}${command}`
    );
  });

  client.on('interactionCreate', async (interaction) => {
    if (interaction.isContextMenu() || interaction.isCommand()) {
      try {
        if (COMMANDS[interaction.commandName]) {
          COMMANDS[interaction.commandName].execute(interaction, container);
          logger.info(
            `${interaction.user.username}: [${interaction.user.id}] ran command ${interaction.commandName}`
          );
        }
      } catch (err) {
        logger.error(
          `Failed to run command ${interaction.commandName} - commandID ${
            interaction.commandId ?? 'no ID'
          }`
        );
      }
    }
  });
  return { client };
};
