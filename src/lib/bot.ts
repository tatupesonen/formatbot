import { Client, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { Command, LegacyCommand } from './interfaces/ICommand';
import StatusCommand from './commands/status';
import { Container } from './container/container';
import { logger } from './util/logger';

export const COMMANDS: Record<string, Command> = {};

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

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    // Special case for bot mentions
    if (
      message.mentions.has(client.user, {
        ignoreEveryone: true,
        ignoreRoles: true,
      }) &&
      message.content.trim().length <= client.user.id.length + 4
    ) {
      (StatusCommand as LegacyCommand).execute(message, [], container);
    }
    if (!message.content.startsWith(prefix)) return;
    // User is bot operator
    // Get message args
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const [commandName, ...commandArgs] = args;
    // Find command from args and run execute
    const command = COMMANDS[commandName];

    if (command.type !== 'LEGACY') return;

    command.execute(message, commandArgs, container);

    logger.warn(
      `${message.author.username}: [${message.author.id}] tried to run nonexistent command ${prefix}${commandName}`
    );
  });

  client.on('interactionCreate', async (interaction) => {
    if (
      (!interaction.isCommand() && !interaction.isContextMenu()) ||
      !interaction.inCachedGuild()
    ) {
      return;
    }

    const command = COMMANDS[interaction.commandName];

    if (!command) {
      return;
    }

    const isSlashCommand =
      interaction.isCommand() && command.type === 'CHAT_INPUT';

    const isContextMenuCommand =
      interaction.isContextMenu() &&
      (command.type === 'MESSAGE' || command.type === 'USER');

    try {
      if (isSlashCommand) {
        command.execute(interaction, container);

        logger.info(
          `${interaction.user.username}: [${interaction.user.id}] ran command ${interaction.commandName}`
        );
      } else if (isContextMenuCommand) {
        command.execute(interaction, container);

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
  });

  return { client };
};
