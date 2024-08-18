import cors from '@fastify/cors';
import fastify from 'fastify';
import { confirmParticipant } from './routes/confirm-participant';
import { confirmTrip } from './routes/confirm-trip';
import { tripRoutes } from './routes/trip-routes';

const app = fastify();

app.register(cors, {
  origin: '*',
});

app.get('/', () => {
  return 'Everything OK!';
});

app.register(tripRoutes);
app.register(confirmTrip);
app.register(confirmParticipant);

app.listen({ port: 3333 }).then(() => {
  console.log('Server running on port 3333');
});
