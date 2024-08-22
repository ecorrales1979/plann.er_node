import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { prisma } from '../../lib/prisma';

const paramsSchema = z.object({
  participantId: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

export async function confirmParticipantController(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const { participantId } = paramsSchema.parse(request.params);

  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
  });

  if (!participant) {
    throw new Error('Participant not found');
  }

  const redirectionUrl = `${process.env.SERVER_URL}/trips/${participant.trip_id}`;

  if (participant.is_confirmed) {
    return reply.redirect(redirectionUrl);
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: { is_confirmed: true },
  });

  return reply.redirect(redirectionUrl);
}
