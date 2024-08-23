import { FastifyInstance } from 'fastify';
import { confirmTripController } from '../controllers/trip-controllers/confirm-trip-controller';
import { createTripController } from '../controllers/trip-controllers/create-trip-controller';
import { listTripController } from '../controllers/trip-controllers/list-trips-controller';
import { updateTripController } from '../controllers/trip-controllers/update-trip-controller';
import { viewTripController } from '../controllers/trip-controllers/view-trip-controller';

export async function tripRoutes(app: FastifyInstance) {
  app.get('/trips', listTripController);
  app.get('/trips/:tripId', viewTripController);
  app.post('/trips', createTripController);
  app.put('/trips/:id', updateTripController);
  app.get('/trips/:tripId/confirm', confirmTripController);
}
