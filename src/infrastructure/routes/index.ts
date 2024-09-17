import { Router, Request, Response } from 'express';
import { CarController, JourneyController, StatusController } from '@controllers';
import { InitializeController } from '../controllers/initialize.controller';
import { FirebaseJourneyRepository } from '@firebase/repository';

const router = Router();

const journeyRepository = new FirebaseJourneyRepository();

router.post('/init', (req, res, next) => { new InitializeController(journeyRepository).init(req, res, next) });
router.get('/status', (req, res, next) => { new StatusController(journeyRepository).checkStatus(req, res, next) });
router.put('/cars', (req, res, next) => { new CarController(journeyRepository).reloadCars(req, res, next) });
router.post('/journey', (req, res, next) => { new JourneyController(journeyRepository).addJourney(req, res, next) });
router.post('/locate', (req, res, next) => { new JourneyController(journeyRepository).getLocation(req, res, next) });
router.post('/dropoff', (req, res, next) => { new JourneyController(journeyRepository).dropOff(req, res, next) });
router.post('/process_journey', (req, res, next) => { new JourneyController(journeyRepository).processJourneys(req, res, next) });

export default router;