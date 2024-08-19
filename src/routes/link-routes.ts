import { FastifyInstance } from 'fastify';
import { createLinkController } from '../controllers/links-controllers/create-link-controller';
import { listLinksController } from '../controllers/links-controllers/list-links-controller';

export async function linkRoutes(app: FastifyInstance) {
  app.get('/trips/:tripId/links', listLinksController);
  app.post('/trips/:tripId/links', createLinkController);
}
