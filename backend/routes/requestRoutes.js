import * as requestControllers from '../controllers/requestController.js';
import express from 'express';

const router = express.Router();

// Defininig ride request routes
router.post('/send',requestControllers.requestRide);
router.get('/received', requestControllers.getReceivedRequests);
router.get('/sent', requestControllers.getSentRequests);
router.post('/ratings/:reqId' , requestControllers.giveRatings);
router.put('/:reqId', requestControllers.answerRequest);
router.delete('/delete/:id', requestControllers.deleteRequest);

export default router;