import cors from '@fastify/cors';
import fastify from 'fastify';
import { errorHandler } from './error-handler';
import { activityRoutes } from './routes/activity-routes';
import { linkRoutes } from './routes/link-routes';
import { participantRoutes } from './routes/participant-routes';
import { tripRoutes } from './routes/trip-routes';

const app = fastify();

app.register(cors, {
  origin: '*',
});

app.setErrorHandler(errorHandler);

app.get('/', () => {
  return 'Everything OK!';
});

app.register(tripRoutes);
app.register(participantRoutes);
app.register(activityRoutes);
app.register(linkRoutes);

app.listen({ port: 3333 }).then(() => {
  console.log('Server running on port 3333');
});
