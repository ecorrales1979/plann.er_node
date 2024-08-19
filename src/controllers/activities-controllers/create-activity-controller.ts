import { FastifyRequest } from 'fastify';
import z from 'zod';
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
    throw new Error('Trip not found');
  }

  if (isDateBeforeAnotherDate(trip.starts_at, occurs_at)) {
    throw new Error(
      'The activity cannot be created on a date before the trip starts'
    );
  }

  if (isDateAfterAnotherDate(occurs_at, trip.ends_at)) {
    throw new Error(
      'The activity cannot be created on a date after the trip finished'
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
