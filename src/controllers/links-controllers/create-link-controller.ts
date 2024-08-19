import { FastifyRequest } from 'fastify';
import z from 'zod';
import { prisma } from '../../lib/prisma';

const paramsSchema = z.object({
  tripId: z.string().uuid(),
});

const bodySchema = z.object({
  title: z.string().min(4),
  url: z.string().url(),
});

type Params = z.infer<typeof paramsSchema>;

export async function createLinkController(
  request: FastifyRequest<{ Params: Params }>
) {
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
}
