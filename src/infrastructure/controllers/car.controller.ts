import { NextFunction, Request, Response } from 'express';
import { ReloadCarsUseCase } from '@use-cases';
import { ValidationService } from '@services';
import { Car } from '../../domain/entities';
import { HTTP_STATUS_CODE } from '@constants';
import { JourneyRepository } from '../../domain/repositories/journey-repository';

export class CarController {
    private reloadCarsUseCase: ReloadCarsUseCase;
    private journeyRepository: JourneyRepository;

    constructor(journeyRepository: JourneyRepository) {
        this.journeyRepository = journeyRepository;
        this.reloadCarsUseCase = new ReloadCarsUseCase(this.journeyRepository);
    }

    async reloadCars(req: Request, res: Response, next: NextFunction) {
        const carSchema = { id: 1, seats: 2 };
        try {
            ValidationService.validateHeaders(req, { 'content-type': 'application/json' });
            ValidationService.validateBody(req?.body ?? {}, carSchema, true);

            const carsData: Car[] = req.body;

            await this.reloadCarsUseCase.execute(carsData);

            return res.status(HTTP_STATUS_CODE.OK).json()
        } catch (error) {
            next(error);
        }
    }
}
