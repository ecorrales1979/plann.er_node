import { FastifyInstance } from 'fastify';
import { z } from 'zod';
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

  app.post('/trips', async (request, reply) => {
    const schema = z.object({
      destination: z.string().min(3),
      starts_at: z.coerce.date(),
      ends_at: z.coerce.date(),
    });

    const data = schema.parse(request.body);

    const trip = await prisma.trip.create({ data });

    return reply.status(201).send({ trip });
  });
}
