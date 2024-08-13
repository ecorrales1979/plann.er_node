import fastify from 'fastify';
import { tripRoutes } from './routes/trip-routes';

const app = fastify();

app.get('/', () => {
  return 'Everything OK!';
});

app.register(tripRoutes);

app.listen({ port: 3333 }).then(() => {
  console.log('Server running on port 3333');
});
