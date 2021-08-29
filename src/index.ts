import { Client } from 'discord.js';
import dotenv from 'dotenv';
import { createBot } from './lib/bot';
import { Container, DITypes } from './lib/container/container';
dotenv.config();

import { PastecordImplementation } from './lib/infra/pastecordintegration';
import { IUploader } from './lib/interfaces/IUploader';

const bootstrap = async () => {
  const container = new Container();
  // Register dependencies
  // Test
  container.set<IUploader>(new PastecordImplementation(), DITypes.uploader);
  const { client: bot } = await createBot(container);
  container.set<Client>(bot, DITypes.client);
  bot.login(process.env.DISCORD_TOKEN);
};
bootstrap();
