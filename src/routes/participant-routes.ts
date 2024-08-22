import { FastifyInstance } from 'fastify';
import { confirmParticipantController } from '../controllers/participant-controllers/confirm-participant-controller';

export async function participantRoutes(app: FastifyInstance) {
  app.get('/participants/:participantId/confirm', confirmParticipantController);
}
