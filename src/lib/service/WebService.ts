import Fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyTypeProvider,
} from 'fastify';
import { Server } from 'http';
import { logger } from '../util/logger';

export class WebService {
  _instance: FastifyInstance;

  public constructor() {
    this._instance = Fastify({ logger: false });
  }

  public register(
    plugin: FastifyPluginCallback<
      FastifyPluginOptions,
      Server,
      FastifyTypeProvider
    >
  ) {
    this._instance.register(plugin);
  }

  public listen(port: number) {
    this._instance.listen({ port, host: '0.0.0.0' }, (err) => {
      if (err) logger.error(err);
      logger.info('Server listening on port ' + port);
    });
  }
}
