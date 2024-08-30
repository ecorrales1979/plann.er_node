import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';
import { env } from '../../utils/env';

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
    throw new ClientError('Participant not found', 404);
  }

  const redirectionUrl = `${env.FRONT_URL}/trips/${participant.trip_id}`;

  if (participant.is_confirmed) {
    return reply.redirect(redirectionUrl);
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: { is_confirmed: true },
  });

  return reply.redirect(redirectionUrl);
}
