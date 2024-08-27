import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';

const paramsSchema = z.object({
  tripId: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

export async function listParticipantsController(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const { tripId } = paramsSchema.parse(request.params);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      participants: {
        select: {
          id: true,
          name: true,
          email: true,
          is_confirmed: true,
        },
      },
    },
  });

  if (!trip) {
    throw new ClientError('Trip not found', 404);
  }

  return reply.send({ participants: trip.participants });
}
