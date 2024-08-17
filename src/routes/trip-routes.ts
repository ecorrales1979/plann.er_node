import { FastifyInstance } from 'fastify';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getMailClient } from '../lib/mail';
import { prisma } from '../lib/prisma';
import { isDateBeforeAnotherDate, isDateBeforeNow } from '../utils/tools';

export async function tripRoutes(app: FastifyInstance) {
  app.get('/trips', async (request, reply) => {
    const trips = await prisma.trip.findMany();
    return reply.send(trips);
  });

  app.get('/trips/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const trip = await prisma.trip.findUnique({
      where: {
        id,
      },
    });

    if (!trip) {
      return reply.status(404).send({ error: 'Trip not found' });
    }

    return reply.send(trip);
  });

  app.post('/trips', async (request, reply) => {
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

    if (isDateBeforeNow(starts_at)) throw new Error('Invalid start date');

    if (isDateBeforeAnotherDate(starts_at, ends_at))
      throw new Error('Invalid end date');

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
          <p>You requested a trip creation to <strong>${destination}</strong> between <strong>${starts_at}</strong> and <strong>${ends_at}</strong>.</p>
          <p></p>
          <p>To confirm your trip, click in the next link:</p>
          <p></p>
          <p>
              <a href="">Confirm trip</a>
          </p>
          <p></p>
          <p>If you don't know what this email is about, just ignore it.</p>
        </div>
      `.trim(),
    });

    console.log(nodemailer.getTestMessageUrl(message));

    return reply.status(201).send({ trip });
  });
}
