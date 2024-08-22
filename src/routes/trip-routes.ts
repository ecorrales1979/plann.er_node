import { FastifyInstance } from 'fastify';
import { createTripController } from '../controllers/trip-controllers/create-trip-controller';
import { listTripController } from '../controllers/trip-controllers/list-trips-controller';
import { viewTripController } from '../controllers/trip-controllers/view-trip-controller';

export async function tripRoutes(app: FastifyInstance) {
  app.get('/trips', listTripController);
  app.get('/trips/:id', viewTripController);
  app.post('/trips', createTripController);
}
