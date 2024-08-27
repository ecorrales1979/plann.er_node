import { FastifyRequest } from 'fastify';
import z from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';
import { isDateBeforeAnotherDate, isDateBeforeNow } from '../../utils/tools';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  destination: z.string().min(3),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
});

type Params = z.infer<typeof paramsSchema>;

export async function updateTripController(
  request: FastifyRequest<{ Params: Params }>
) {
  const { id } = paramsSchema.parse(request.params);
  const { destination, ends_at, starts_at } = bodySchema.parse(request.body);

  const trip = await prisma.trip.findUnique({
    where: { id },
  });

  if (!trip) {
    throw new ClientError('Trip not found', 404);
  }

  if (isDateBeforeNow(starts_at)) {
    throw new ClientError('Invalid start date', 409);
  }

  if (isDateBeforeAnotherDate(starts_at, ends_at)) {
    throw new ClientError('Invalid end date', 409);
  }

  await prisma.trip.update({
    where: { id },
    data: { destination, ends_at, starts_at },
  });

  return { tripId: id };
}
