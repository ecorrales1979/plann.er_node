import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ClientError } from './errors/client-error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log(error);
  if (error instanceof ClientError) {
    return reply.status(error.code).send({ message: error.message });
  }

  return reply.status(500).send({ message: 'Internal server error' });
};
