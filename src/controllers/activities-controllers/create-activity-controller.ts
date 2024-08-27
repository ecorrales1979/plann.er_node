import { FastifyRequest } from 'fastify';
import z from 'zod';
import { ClientError } from '../../errors/client-error';
import { prisma } from '../../lib/prisma';
import {
  isDateAfterAnotherDate,
  isDateBeforeAnotherDate,
} from '../../utils/tools';

const paramsSchema = z.object({
  tripId: z.string().uuid(),
});

const bodySchema = z.object({
  title: z.string().min(4),
  occurs_at: z.coerce.date(),
});

type Params = z.infer<typeof paramsSchema>;

export async function createActivityController(
  request: FastifyRequest<{ Params: Params }>
) {
  const { tripId } = paramsSchema.parse(request.params);
  const { occurs_at, title } = bodySchema.parse(request.body);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw new ClientError('Trip not foundy', 404);
  }

  if (isDateBeforeAnotherDate(trip.starts_at, occurs_at)) {
    throw new ClientError(
      'The activity cannot be created on a date before the trip starts',
      409
    );
  }

  if (isDateAfterAnotherDate(occurs_at, trip.ends_at)) {
    throw new ClientError(
      'The activity cannot be created on a date after the trip finished',
      409
    );
  }

  const activity = await prisma.activity.create({
    data: {
      occurs_at,
      title,
      trip_id: tripId,
    },
  });

  return { activityId: activity.id };
}
