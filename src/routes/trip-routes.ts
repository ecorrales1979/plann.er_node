import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function tripRoutes(app: FastifyInstance) {
  app.get('/trips', async (request, reply) => {
    const trips = await prisma.trip.findMany();
    return reply.send(trips);
  });

  app.get('/trips/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const trip = await prisma.trip.findUnique({
      where: {
        id,
      },
    });

    if (!trip) {
      return reply.status(404).send({ error: 'Trip not found' });
    }

    return reply.send(trip);
  });
}
