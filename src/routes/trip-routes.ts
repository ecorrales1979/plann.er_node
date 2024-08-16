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
    });

    const data = schema.parse(request.body);

    if (isDateBeforeNow(data.starts_at)) throw new Error('Invalid start date');

    if (isDateBeforeAnotherDate(data.starts_at, data.ends_at))
      throw new Error('Invalid end date');

    const trip = await prisma.trip.create({ data });

    const mail = await getMailClient();
    const message = await mail.sendMail({
      from: {
        name: 'Plann.er Team',
        address: 'support@plann.er',
      },
      to: {
        name: data.owner_name,
        address: data.owner_email,
      },
      subject: 'Your trip has been created!',
      html: `<p>Your trip to ${data.destination} has been created successfully!</p>`,
    });

    console.log(nodemailer.getTestMessageUrl(message));

    return reply.status(201).send({ trip });
  });
}
