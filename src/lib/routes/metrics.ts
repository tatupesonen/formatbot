import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyTypeProvider,
} from 'fastify';
import { Server } from 'http';
import prometheus from 'prom-client';

export const metrics: FastifyPluginCallback<
  FastifyPluginOptions,
  Server,
  FastifyTypeProvider
> = (fastify: FastifyInstance, _, done) => {
  fastify.get('/metrics', async (_, res) => {
    const metrics = await prometheus.register.metrics();
    res.send(metrics);
  });
  done();
};
