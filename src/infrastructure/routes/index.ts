import { Router, Request, Response } from 'express';
import { CarController, JourneyController, StatusController } from '@controllers';
import { InitializeController } from '../controllers/initialize.controller';

const router = Router();

router.post('/init', (req, res, next) => { new InitializeController().init(req, res, next) });
router.get('/status', (req, res, next) => { new StatusController().checkStatus(req, res, next) });
router.put('/cars', (req, res, next) => { new CarController().reloadCars(req, res, next) });
router.post('/journey', (req, res, next) => { new JourneyController().addJourney(req, res, next) });
router.post('/locate', (req, res, next) => { new JourneyController().getLocation(req, res, next) });
router.post('/dropoff', (req, res, next) => { new JourneyController().dropOff(req, res, next) });
router.post('/process_journey', (req, res, next) => { new JourneyController().processJourneys(req, res, next) });

export default router;