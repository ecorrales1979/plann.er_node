import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function listTripController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const trips = await prisma.trip.findMany();
  return reply.send(trips);
}
