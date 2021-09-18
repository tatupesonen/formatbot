import { Client } from 'discord.js';
import dotenv from 'dotenv';
import { createBot } from './lib/bot';
import { Container, DITypes } from './lib/container/container';
dotenv.config();

import { PastecordImplementation } from './lib/infra/pastecordintegration';
import { IDetector } from './lib/interfaces/IDetector';
import { IParser } from './lib/interfaces/IParser';
import { IUploader } from './lib/interfaces/IUploader';
import { GuesslangDetector } from './lib/util/Detector';
import { Parser } from './lib/util/MessageParser';

// Forcing CI

const bootstrap = async () => {
  const container = new Container();
  // Register dependencies
  container.set<IUploader>(new PastecordImplementation(), DITypes.uploader);
  container.set<IDetector>(new GuesslangDetector(), DITypes.detector);
  container.set<IParser>(new Parser(), DITypes.parser);
  const { client: bot } = await createBot(container);
  container.set<Client>(bot, DITypes.client);
  bot.login(process.env.DISCORD_TOKEN);
};
bootstrap();
