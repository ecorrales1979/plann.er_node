import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const paramsSchema = z.object({
  tripId: z.string().uuid(),
});

const bodySchema = z.object({
  title: z.string().min(4),
  url: z.string().url(),
});

type Params = z.infer<typeof paramsSchema>;

export async function linkRoutes(app: FastifyInstance) {
  app.get<{ Params: Params }>('/trips/:tripId/links', async (request) => {
    const { tripId } = paramsSchema.parse(request.params);

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        links: true,
      },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    return { links: trip.links };
  });

  app.post<{ Params: Params }>('/trips/:tripId/links', async (request) => {
    const { tripId } = paramsSchema.parse(request.params);
    const { url, title } = bodySchema.parse(request.body);

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    const link = await prisma.link.create({
      data: {
        title,
        url,
        trip_id: tripId,
      },
    });

    return { linkId: link.id };
  });
}
