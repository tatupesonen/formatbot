import { Client } from 'discord.js';
import dotenv from 'dotenv';
import { createBot } from './lib/bot';
import { Container, DITypes } from './lib/container/container';
dotenv.config();

import { PastecordImplementation } from './lib/infra/pastecordintegration';
import { IDetector } from './lib/interfaces/IDetector';
import { IParser } from './lib/interfaces/IParser';
import { IUploader } from './lib/interfaces/IUploader';
import { FormatService } from './lib/service/FormatService';
import { LaTeXService } from './lib/service/LaTeXService';
import { WebService } from './lib/service/WebService';
import { GuesslangDetector } from './lib/util/Detector';
import { Parser } from './lib/util/MessageParser';
import prometheus from 'prom-client';
import { metrics } from './lib/routes/metrics';
import { createCallbackMetrics, zeroLanguageMetrics } from './lib/util/metrics';

// Forcing CI

const bootstrap = async () => {
  const container = new Container();

  // Create metrics
  prometheus.collectDefaultMetrics();

  // Register dependencies
  const webServer = new WebService();
  webServer.register(metrics);

  container.set(webServer, DITypes.api);
  // Start listening on the webserver
  webServer.listen(3000);

  container.set<IUploader>(new PastecordImplementation(), DITypes.uploader);
  container.set<IDetector>(new GuesslangDetector(), DITypes.detector);
  container.set<IParser>(new Parser(), DITypes.parser);
  const formatService = new FormatService(container);
  const latexService = new LaTeXService(container);
  container.set<FormatService>(formatService, DITypes.formatService);
  container.set<LaTeXService>(latexService, DITypes.latexService);
  const { client: bot } = await createBot(container);
  container.set<Client>(bot, DITypes.client);

  bot.login(process.env.DISCORD_TOKEN);

  // Create here to ensure cache is populated
  zeroLanguageMetrics();
  createCallbackMetrics(container);
};
bootstrap();
