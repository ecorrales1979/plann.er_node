import dayjs from 'dayjs';
import { FastifyRequest } from 'fastify';
import z from 'zod';
import { prisma } from '../../lib/prisma';
import { differenceInDaysBetweenTwoDates } from '../../utils/tools';

const paramsSchema = z.object({
  tripId: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

export async function listActivitiesController(
  request: FastifyRequest<{ Params: Params }>
) {
  const { tripId } = paramsSchema.parse(request.params);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      activities: {
        orderBy: {
          occurs_at: 'asc',
        },
      },
    },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  const tripDays = differenceInDaysBetweenTwoDates(
    trip.starts_at,
    trip.ends_at
  );

  const activities = Array.from({ length: tripDays + 1 }).map((_, index) => {
    const date = dayjs(trip.starts_at).add(index, 'days');
    return {
      date: date.toDate(),
      activities: trip.activities.filter((activity) => {
        return dayjs(activity.occurs_at).isSame(date, 'day');
      }),
    };
  });

  return { activities };
}
