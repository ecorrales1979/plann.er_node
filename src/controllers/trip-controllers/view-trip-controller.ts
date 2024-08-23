import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { prisma } from '../../lib/prisma';

const paramsSchema = z.object({
  tripId: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

export async function viewTripController(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const { tripId } = paramsSchema.parse(request.params);

  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
  });

  if (!trip) {
    return reply.status(404).send({ error: 'Trip not found' });
  }

  return { trip };
}
