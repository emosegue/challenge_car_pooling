import { NextFunction, Request, Response } from 'express';
import { AddGroupUseCase, GetGroupByGroupIdUseCase, GetJourneyCarByGroupIdUseCase, GetCarUseCase, DropOffJourneyUseCase } from '@use-cases';
import { FirebaseJourneyRepository } from '@firebase/repository';
import { ValidationService } from '@services';
import { JourneyData, CarData, GroupData } from '@models';
import { HTTP_STATUS_CODE } from '@constants';

export class JourneyController {
    private getGroupByGroupId: GetGroupByGroupIdUseCase;
    private getJourneyByCarId: GetJourneyCarByGroupIdUseCase;
    private addGroup: AddGroupUseCase;
    private removeJourneyByGroupId: DropOffJourneyUseCase
    private getCarById: GetCarUseCase

    constructor() {
        const journeyRepository = new FirebaseJourneyRepository();
        this.getGroupByGroupId = new GetGroupByGroupIdUseCase(journeyRepository);
        this.getJourneyByCarId = new GetJourneyCarByGroupIdUseCase(journeyRepository);
        this.removeJourneyByGroupId = new DropOffJourneyUseCase(journeyRepository);
        this.addGroup = new AddGroupUseCase(journeyRepository);
        this.getCarById = new GetCarUseCase(journeyRepository);
    }

    async addJourney(req: Request, res: Response, next: NextFunction) {
        const groupSchema: GroupData = { id: 1, people: 2 };
        try {
            ValidationService.validateHeaders(req, { 'content-type': 'application/json' })
            ValidationService.validateBody(req?.body, groupSchema, true);

            const data: GroupData = req?.body;

            await this.addGroup.execute(data);

            // TODO: add use case to match group with car

            return res.status(HTTP_STATUS_CODE.OK).json()
        } catch (error) {
            next(error);
        }
    }

    async dropOff(req: Request, res: Response, next: NextFunction) {
        try {
            ValidationService.validateHeaders(req, { 'content-type': 'application/x-www-form-urlencoded' })
            const unserializedBody = JSON.parse(JSON.stringify(req?.body))
            ValidationService.validateBody(unserializedBody, { ID: '1' }, true);

            const groupId = Number(unserializedBody.ID);

            await this.removeJourneyByGroupId.execute(groupId)

            // TODO: add use case to match group with car

            return res.status(HTTP_STATUS_CODE.OK).json()
        } catch (error) {
            next(error);
        }
    }

    async getLocation(req: Request, res: Response, next: NextFunction) {
        try {
            ValidationService.validateMultipleHeaders(req, { 'content-type': ['application/x-www-form-urlencoded', 'application/json'] })
            const unserializedBody = JSON.parse(JSON.stringify(req?.body))

            if (req.headers['application/x-www-form-urlencoded']) {
                ValidationService.validateBody(unserializedBody, { ID: '1' }, true);
            }

            if (req.headers['application/json']) {
                ValidationService.validateBody(unserializedBody, { ID: 1 }, true);
            }


            const groupId = Number(unserializedBody.ID);
            const journey: JourneyData = await this.getJourneyByCarId.execute(groupId);

            if (journey) {
                const car: CarData = await this.getCarById.execute(journey.car);
                return res.status(HTTP_STATUS_CODE.OK).json(car);
            }

            const group: GroupData = await this.getGroupByGroupId.execute(groupId)

            if (group) {
                return res.status(HTTP_STATUS_CODE.NO_CONTENT).json()
            }

            return res.status(HTTP_STATUS_CODE.NOT_FOUND).json()
        } catch (error) {
            next(error);
        }
    }
}
