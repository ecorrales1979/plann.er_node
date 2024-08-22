import { FastifyInstance } from 'fastify';
import { confirmParticipantController } from '../controllers/participant-controllers/confirm-participant-controller';
import { listParticipantsController } from '../controllers/participant-controllers/list-participants-controller';

export async function participantRoutes(app: FastifyInstance) {
  app.get('/participants/:participantId/confirm', confirmParticipantController);
  app.get('/trips/:tripId/participants', listParticipantsController);
}
