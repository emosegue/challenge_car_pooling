import { Request, Response, NextFunction } from 'express';
import { validateHeaders, validateBody } from '../services/validate-params';
import { HTTP_STATUS_CODE, DB_COLLECTION } from '@constants';
import { getItemByField } from '@firebase/db';

export async function DropoffController(req: Request, res: Response, next: NextFunction) {
    const groupSchema = { ID: "1" };
    try {
        validateHeaders(req, { 'content-type': 'application/x-www-form-urlencoded' })
        const unserializedBody = JSON.parse(JSON.stringify(req?.body))
        validateBody(unserializedBody, groupSchema, false);

        const id = Number(unserializedBody.ID);
        const group = await getItemByField<any>('id', id, DB_COLLECTION.GROUPS);

        if (group) {
            return res.status(HTTP_STATUS_CODE.OK).json(group)
        }

        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: 'group not found' })
    } catch (error) {
        next(error);
    }
}