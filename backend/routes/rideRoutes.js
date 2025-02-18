import * as rideControllers from '../controllers/rideController.js';
import express from 'express';

const router = express.Router();


// Defining ride routes
router.get('/search', rideControllers.searchRide);
router.post('/create', rideControllers.createRide);
router.get('/created', rideControllers.createdRides);
router.delete('/delete/:id', rideControllers.deleteRide);


export default router;

