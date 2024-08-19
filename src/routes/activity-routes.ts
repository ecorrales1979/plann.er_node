import { FastifyInstance } from 'fastify';
import { createActivityController } from '../controllers/activities-controllers/create-activity-controller';
import { listActivitiesController } from '../controllers/activities-controllers/list-activities-controller';

export async function activityRoutes(app: FastifyInstance) {
  app.get('/trips/:tripId/activities', listActivitiesController);
  app.post('/trips/:tripId/activities', createActivityController);
}
