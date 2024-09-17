import { NextFunction, Request, Response } from 'express';
import { FirebaseJourneyRepository } from '@firebase/repository';
import { LoggerService } from '@services';
import { Car, Group } from '../../domain/entities';
import { DB_COLLECTION, HTTP_STATUS_CODE } from '@constants';

export class InitializeController {
    private logger = LoggerService.getInstance();;

    constructor() { }

    async init(req: Request, res: Response, next: NextFunction) {
        const { car_amount: carAmount, group_amount: groupAmount } = req?.body;
        const repository = new FirebaseJourneyRepository();
        const carGenerationData = await this.generateCars(repository, carAmount);
        const groupGenerationData = await this.generateGroups(repository, groupAmount);

        try {
            return res.status(HTTP_STATUS_CODE.OK).json({
                carGenerationData,
                groupGenerationData
            })
        }
        catch (error) {
            next(error);
        }
    }

    async generateCars(repository: FirebaseJourneyRepository, amount: number) {
        const startTime = performance.now();
        const carCollection: Car[] = []
        for (let i = 1; i <= amount; i++) {
            const car: Car = {
                id: i,
                seats: Math.floor(Math.random() * 7) + 1,
                is_available: true,
            };
            carCollection.push(car);
        }

        await repository.removeAllItems(DB_COLLECTION.CARS);
        await repository.insertBulkItems(carCollection, DB_COLLECTION.CARS);

        const endTime = performance.now();
        const elapsedTime = endTime - startTime

        this.logger.info(`Car generation took ${elapsedTime} milliseconds.`);

        return {
            amount,
            generated_time: `${elapsedTime.toFixed(2)} ms.`
        }
    }

    async generateGroups(repository: FirebaseJourneyRepository, amount: number) {
        const startTime = performance.now();
        const groupCollection: Group[] = []
        for (let i = 1; i <= amount; i++) {
            const group: Group = {
                id: i,
                people: Math.floor(Math.random() * 7) + 1,
                is_traveling: false,
            };
            groupCollection.push(group);
        }

        await repository.removeAllItems(DB_COLLECTION.GROUPS);
        await repository.insertBulkItems(groupCollection, DB_COLLECTION.GROUPS);

        const endTime = performance.now();
        const elapsedTime = endTime - startTime

        this.logger.info(`Group generation took ${elapsedTime} milliseconds.`);

        return {
            amount,
            generated_time: `${elapsedTime.toFixed(2)} ms.`
        }
    }
}