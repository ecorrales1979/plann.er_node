import { FastifyRequest } from 'fastify';
import z from 'zod';
import { prisma } from '../../lib/prisma';

const paramsSchema = z.object({
  participantId: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

export async function getParticipantController(
  request: FastifyRequest<{ Params: Params }>
) {
  const { participantId } = paramsSchema.parse(request.params);

  const participant = await prisma.participant.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      is_confirmed: true,
    },
    where: { id: participantId },
  });

  if (!participant) {
    throw new Error('Participant not found');
  }

  return { participant };
}
