import { Router, Request, Response } from 'express';
import { CarController, JourneyController, StatusController } from '@controllers';

const router = Router();

router.get('/status', (req, res, next) => { new StatusController().checkStatus(req, res, next) });
router.put('/cars', (req, res, next) => { new CarController().process(req, res, next) });
router.post('/journey', (req, res, next) => { new JourneyController().addJourney(req, res, next) });
router.post('/locate', (req, res, next) => { new JourneyController().getLocation(req, res, next) });
router.post('/dropoff', (req, res, next) => { new JourneyController().dropOff(req, res, next) });

export default router;