import { NextFunction, Request, Response } from 'express';
import { ReloadCarsUseCase } from '@use-cases';
import { FirebaseJourneyRepository } from '@firebase/repository';
import { ValidationService } from '@services';
import { Car } from '../../domain/entities';
import { HTTP_STATUS_CODE } from '@constants';

export class CarController {
    private reloadCarsUseCase: ReloadCarsUseCase;

    constructor() {
        const journeyRepository = new FirebaseJourneyRepository();
        this.reloadCarsUseCase = new ReloadCarsUseCase(journeyRepository);
    }

    async reloadCars(req: Request, res: Response, next: NextFunction) {
        const carSchema = { id: 1, seats: 2 };
        try {
            ValidationService.validateHeaders(req, { 'content-type': 'application/json' });
            ValidationService.validateBody(req?.body ?? {}, carSchema, true);

            const carsData: Car[] = req.body;

            await this.reloadCarsUseCase.execute(carsData);

            // TODO: add use case to match group with car

            return res.status(HTTP_STATUS_CODE.OK).json()
        } catch (error) {
            next(error);
        }

    }
}
