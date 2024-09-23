import { NextFunction, Request, Response } from 'express';
import {
    AddGroupUseCase,
    GetGroupByGroupIdUseCase,
    GetJourneyCarByGroupIdUseCase,
    GetCarUseCase,
    DropOffJourneyUseCase,
    CreateOrUpdateJourneysUseCase
} from '@use-cases';
import { ValidationService } from '@services';
import { Journey, Car, Group } from '../../domain/entities';
import { HTTP_STATUS_CODE } from '@constants';
import { GroupDto, CarDto } from '@dtos';
import { JourneyRepository } from '../../domain/repositories/journey-repository';

export class JourneyController {
    private journeyRepository: JourneyRepository
    private getGroupByGroupId: GetGroupByGroupIdUseCase;
    private getJourneyByCarId: GetJourneyCarByGroupIdUseCase;
    private addGroup: AddGroupUseCase;
    private removeJourneyByGroupId: DropOffJourneyUseCase;
    private getCarById: GetCarUseCase;

    private createOrUpdateJourneys: CreateOrUpdateJourneysUseCase;

    constructor(journeyRepository: JourneyRepository) {
        this.journeyRepository = journeyRepository;
        this.getGroupByGroupId = new GetGroupByGroupIdUseCase(this.journeyRepository);
        this.getJourneyByCarId = new GetJourneyCarByGroupIdUseCase(this.journeyRepository);
        this.removeJourneyByGroupId = new DropOffJourneyUseCase(this.journeyRepository);
        this.addGroup = new AddGroupUseCase(this.journeyRepository);
        this.getCarById = new GetCarUseCase(this.journeyRepository);
        this.createOrUpdateJourneys = new CreateOrUpdateJourneysUseCase(this.journeyRepository);
    }

    async addJourney(req: Request, res: Response, next: NextFunction) {
        const groupSchema: GroupDto = { id: 1, people: 2 };
        try {
            ValidationService.validateHeaders(req, { 'content-type': 'application/json' })
            ValidationService.validateBody(req?.body, groupSchema, true);

            const data: Group = req?.body;

            await this.addGroup.execute(data);
            await this.createOrUpdateJourneys.execute();

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

            await this.removeJourneyByGroupId.execute(groupId);
            await this.createOrUpdateJourneys.execute();

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
            const journey: Journey = await this.getJourneyByCarId.execute(groupId);

            if (journey) {
                const car: CarDto = await this.getCarById.execute(journey.car);
                return res.status(HTTP_STATUS_CODE.OK).json(car);
            }

            const group: Group = await this.getGroupByGroupId.execute(groupId)

            if (group) {
                return res.status(HTTP_STATUS_CODE.NO_CONTENT).json()
            }

            return res.status(HTTP_STATUS_CODE.NOT_FOUND).json()
        } catch (error) {
            next(error);
        }
    }

    async processJourneys(req: Request, res: Response, next: NextFunction) {
        try {
            const journey = await this.createOrUpdateJourneys.execute();
            return res.status(HTTP_STATUS_CODE.OK).json(journey);
        } catch (error) {
            next(error);
        }
    }
}
