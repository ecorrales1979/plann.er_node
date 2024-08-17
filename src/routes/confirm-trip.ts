import { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    `/trips/:tripId/confirmation`,
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new Error('Trip not found');
      }

      if (trip.is_confirmed) {
        return reply.redirect(`${process.env.SERVER_URL}/trips/${tripId}`);
      }

      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true },
      });

      return { tripId };
    }
  );
}
