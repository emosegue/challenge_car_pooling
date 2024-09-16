import { Request, Response, NextFunction } from 'express';
import { CarData } from '@models';
import { HTTP_STATUS_CODE, DB_COLLECTION } from '@constants';
import { emptyCollection, insertBulkItems } from '@firebase/db';
import { ValidationService } from '@services';

export async function CarController(req: Request, res: Response, next: NextFunction) {
    const carSchema: CarData = { id: 1, seats: 2 };
    try {
        ValidationService.validateHeaders(req, { 'content-type': 'application/json' })
        ValidationService.validateBody(req?.body ?? {}, carSchema, true);

        const carsData: CarData[] = req.body;

        await emptyCollection(DB_COLLECTION.CARS);
        await insertBulkItems(carsData, DB_COLLECTION.CARS)

        return res.status(HTTP_STATUS_CODE.OK).json()
    } catch (error) {
        next(error);
    }
}