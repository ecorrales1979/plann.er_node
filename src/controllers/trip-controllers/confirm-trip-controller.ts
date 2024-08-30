import { FastifyReply, FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';
import { ClientError } from '../../errors/client-error';
import { getMailClient } from '../../lib/mail';
import { prisma } from '../../lib/prisma';
import { env } from '../../utils/env';
import { formatDateRange } from '../../utils/formatters';

const paramsSchema = z.object({
  tripId: z.string().uuid(),
});

type Params = z.infer<typeof paramsSchema>;

export async function confirmTripController(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const { tripId } = paramsSchema.parse(request.params);
  const redirectionUrl = `${env.FRONT_URL}/trips/${tripId}`;

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      participants: {
        where: { is_owner: false },
      },
    },
  });

  if (!trip) {
    throw new ClientError('Trip not found', 404);
  }

  if (trip.is_confirmed) {
    return reply.redirect(redirectionUrl);
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: { is_confirmed: true },
  });

  const formattedDates = formatDateRange(trip.starts_at, trip.ends_at);

  const mail = await getMailClient();

  await Promise.all(
    trip.participants.map(async (participant) => {
      const confirmationLink = `${env.SERVER_URL}/participants/${participant.id}/confirm`;
      const message = await mail.sendMail({
        from: {
          name: 'Plann.er Team',
          address: 'support@plann.er',
        },
        to: participant.email,
        subject: `Confirm your presence on the trip to ${trip.destination}`,
        html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>You have been invited to participate in a trip to <strong>${trip.destination}</strong> on <strong>${formattedDates}</strong>.</p>
              <p></p>
              <p>To confirm your presence on the trip, click on the link below:</p>
              <p></p>
              <p>
                  <a href="${confirmationLink}">Confirm trip</a>
              </p>
              <p></p>
              <p>If you don't know what this email is about, just ignore it.</p>
            </div>
          `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));
    })
  );

  return reply.redirect(redirectionUrl);
}
