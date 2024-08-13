import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function tripRoutes(app: FastifyInstance) {
  app.get('/trips', async (request, reply) => {
    const trips = await prisma.trip.findMany();
    return reply.send(trips);
  });
}
