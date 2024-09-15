import { Request, Response, NextFunction } from 'express';
import { validateHeaders, validateBody } from '../services/validate-params';
import { GroupData } from '@models';
import { HTTP_STATUS_CODE, DB_COLLECTION } from '@constants';
import { insertItem } from '@firebase/db';

export async function JourneyController(req: Request, res: Response, next: NextFunction) {
    const groupSchema: GroupData = { id: 1, people: 2 };
    try {
        validateHeaders(req, { 'content-type': 'application/json' })
        validateBody(req?.body, groupSchema, false);

        const group: GroupData = req?.body;

        await insertItem(group, DB_COLLECTION.GROUPS);

        return res.status(HTTP_STATUS_CODE.OK).json()
    } catch (error) {
        next(error);
    }
}