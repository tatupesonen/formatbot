import { Client } from 'discord.js';
import { config } from 'dotenv';
import { createBot } from './lib/bot';
import { Container, DITypes } from './lib/container/container';
import { PastecordImplementation } from './lib/infra/pastecordintegration';
import { IUploader } from './lib/interfaces/IUploader';

config();
// Forcing CI

const bootstrap = async () => {
  const container = new Container();
  // Register dependencies
  container.set<IUploader>(new PastecordImplementation(), DITypes.uploader);
  const { client: bot } = await createBot(container);
  container.set<Client>(bot, DITypes.client);
  bot.login(process.env.DISCORD_TOKEN);
};
bootstrap();
