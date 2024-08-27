import { FastifyRequest } from 'fastify';
import z from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';

const paramsSchema = z.object({
  tripId: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

export async function listLinksController(
  request: FastifyRequest<{ Params: Params }>
) {
  const { tripId } = paramsSchema.parse(request.params);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      links: true,
    },
  });

  if (!trip) {
    throw new ClientError('Trip not found', 404);
  }

  return { links: trip.links };
}
