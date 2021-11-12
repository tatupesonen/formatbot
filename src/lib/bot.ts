import { Client, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { COMMAND_TYPE, Command } from './interfaces/ICommand';
import StatusCommand from './commands/status';
import { Container } from './container/container';
import { logger } from './util/logger';

export const COMMANDS: Record<
  string,
  // Using `unknown | any` because the type of args are not known here
  // when narrowing down, `unknown` would allow for string arguments
  // and `any` would allow for any other type of arguments.
  // Technically just `any` would do the job too, but it is not 100% accurate.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Command<COMMAND_TYPE, [unknown | any]>
> = {};

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
      StatusCommand.execute(message, container);
    }
    if (!message.content.startsWith(prefix)) return;
    // User is bot operator
    // Get message args
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const [commandName, ...commandArgs] = args;
    // Find command from args and run execute
    const command = COMMANDS[commandName];

    if (command.type !== COMMAND_TYPE.LEGACY) return;

    if (typeof command.resolveArgs === 'function') {
      const resolvedArgs = await command.resolveArgs(message, commandArgs);

      return command.execute(message, resolvedArgs, container);
    } else if (command) {
      return command.execute(message, commandArgs, container);
    }
    logger.warn(
      `${message.author.username}: [${message.author.id}] tried to run nonexistent command ${prefix}${commandName}`
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
