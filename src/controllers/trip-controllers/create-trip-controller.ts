import { FastifyReply, FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';
import { ClientError } from '../../errors/client-error';
import { getMailClient } from '../../lib/mail';
import { prisma } from '../../lib/prisma';
import { env } from '../../utils/env';
import { formatDateRange } from '../../utils/formatters';
import { isDateBeforeAnotherDate, isDateBeforeNow } from '../../utils/tools';

export async function createTripController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const schema = z.object({
    destination: z.string().min(3),
    starts_at: z.coerce.date(),
    ends_at: z.coerce.date(),
    owner_name: z.string(),
    owner_email: z.string().email(),
    emails_to_invite: z.array(z.string().email()),
  });

  const {
    destination,
    emails_to_invite,
    ends_at,
    owner_email,
    owner_name,
    starts_at,
  } = schema.parse(request.body);

  if (isDateBeforeNow(starts_at))
    throw new ClientError('Invalid start date', 409);

  if (isDateBeforeAnotherDate(starts_at, ends_at))
    throw new ClientError('Invalid end date', 409);

  const trip = await prisma.trip.create({
    data: {
      destination,
      ends_at,
      starts_at,
      participants: {
        createMany: {
          data: [
            {
              name: owner_name,
              email: owner_email,
              is_confirmed: true,
              is_owner: true,
            },
            ...emails_to_invite.map((email) => {
              return { email };
            }),
          ],
        },
      },
    },
  });

  const formattedDates = formatDateRange(starts_at, ends_at);
  const confirmationLink = `${env.SERVER_URL}/trips/${trip.id}/confirm`;

  const mail = await getMailClient();
  const message = await mail.sendMail({
    from: {
      name: 'Plann.er Team',
      address: 'support@plann.er',
    },
    to: {
      name: owner_name,
      address: owner_email,
    },
    subject: `Confirm your trip to ${destination}`,
    html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>You requested a trip creation to <strong>${destination}</strong> on <strong>${formattedDates}</strong>.</p>
          <p></p>
          <p>To confirm your trip, click in the next link:</p>
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

  return reply.status(201).send({ trip });
}
