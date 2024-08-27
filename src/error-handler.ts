import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { ClientError } from './errors/client-error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof ZodError) {
    return reply
      .status(409)
      .send({ messgae: 'Invalid inputs', errors: error.flatten().fieldErrors });
  }

  if (error instanceof ClientError) {
    return reply.status(error.code).send({ message: error.message });
  }

  return reply.status(500).send({ message: 'Internal server error' });
};
