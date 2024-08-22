import { FastifyRequest } from 'fastify';
import z from 'zod';
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
    throw new Error();
  }

  if (isDateBeforeNow(starts_at)) {
    throw new Error('Invalid start date');
  }

  if (isDateBeforeAnotherDate(starts_at, ends_at)) {
    throw new Error('Invalid end date');
  }

  await prisma.trip.update({
    where: { id },
    data: { destination, ends_at, starts_at },
  });

  return { tripId: id };
}
