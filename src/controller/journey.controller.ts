import { Request, Response, NextFunction } from 'express';
import { validateHeaders, validateBody } from '../services/validate-params';
import { GroupData } from '@models';
import { HTTP_STATUS_CODE, DB_COLLECTION } from '@constants';
import { emptyCollection, insertBulkItems } from '@firebase/db';

export async function JourneyController(req: Request, res: Response, next: NextFunction) {
    const carSchema: GroupData = { id: 1, people: 2 };
    try {
        validateHeaders(req, { 'content-type': 'application/json' })
        validateBody(req?.body ?? {}, carSchema, false);

        const carsData: GroupData[] = req.body;

        return res.status(HTTP_STATUS_CODE.OK).json()
    } catch (error) {
        next(error);
    }
}