import { NextFunction, Request, Response } from 'express';
import { DB_COLLECTION, HTTP_STATUS_CODE } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journey-repository';

export class StatusController {
    private journeyRepository: JourneyRepository;

    constructor(journeyRepository: JourneyRepository) {
        this.journeyRepository = journeyRepository;
    }

    /*
        In case we have more services to test, they would be added to this function.
    */
    async checkStatus(_req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.journeyRepository.testConnection(DB_COLLECTION.CARS);
            return res.status(HTTP_STATUS_CODE.OK).json({ message: 'System is healthy' });
        } catch (error) {
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'System is unhealty' });
        }
    }
}