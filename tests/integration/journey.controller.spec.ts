import { JourneyController } from '@controllers';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS_CODE } from '@constants';
import { FirebaseJourneyRepository } from '@firebase/repository';

jest.mock('@firebase/repository', () => {
    return {
        FirebaseJourneyRepository: jest.fn().mockImplementation(() => ({
            removeAllItems: jest.fn(),
            insertBulkItems: jest.fn(),
            getItemsByCondition: jest.fn(),
            insertItem: jest.fn(),
            updateFieldItemById: jest.fn(),
            removeItemByField: jest.fn(),
            getItemByField: jest.fn(),
        })),
    };
});

const app = express();
app.use(express.json());

const mockRepository = new FirebaseJourneyRepository();
const journeyController = new JourneyController(mockRepository);
app.post('/journey', (req, res, next) => journeyController.addJourney(req, res, next));
app.post('/locate', (req, res, next) => journeyController.getLocation(req, res, next));
app.post('/dropoff', (req, res, next) => journeyController.dropOff(req, res, next));

describe('journeyController Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with status 200 when a group was added successfully', async () => {
        const journeyData = { id: 1, people: 4 }

        jest.spyOn(mockRepository, 'getItemsByCondition').mockImplementation(async (collection, condition) => {
            if (collection === 'cars' && condition === 'is_available') {
                return Promise.resolve([{ id: 1, seats: 4 }, { id: 2, seats: 2 }]);
            } else if (collection === 'groups' && condition === 'is_traveling') {
                return Promise.resolve([{ id: 1, people: 5 }]);
            }

            jest.spyOn(mockRepository, 'insertItem').mockResolvedValue(undefined);
            jest.spyOn(mockRepository, 'updateFieldItemById').mockResolvedValue(undefined);

            const response = await request(app)
                .post('/journey')
                .send(journeyData)
                .set('content-type', 'application/json');

            expect(response.status).toBe(HTTP_STATUS_CODE.OK);
        });
    });

    it('should respond with status 400 when a group input data is wrong', async () => {
        const journeyData = { id2: 1, people: 4 }

        const response = await request(app)
            .post('/journey')
            .send(journeyData)
            .set('content-type', 'application/json');

        expect(response.status).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    });

    it('should respond with status 500 when some database operation was failed', async () => {
        const journeyData = { id: 1, people: 4 }

        jest.spyOn(mockRepository, 'getItemsByCondition').mockRejectedValue(new Error('Unexpected error'))

        const response = await request(app)
            .post('/journey')
            .send(journeyData)
            .set('content-type', 'application/json');

        expect(response.status).toBe(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it('should respond with status 200 when a dropoff was executed successfully', async () => {
        jest.spyOn(mockRepository, 'removeItemByField').mockResolvedValue(undefined);
        jest.spyOn(mockRepository, 'getItemsByCondition').mockImplementation(async (collection, condition) => {
            const dropOffData = 'ID=1';
            if (collection === 'cars' && condition === 'is_available') {
                return Promise.resolve([{ id: 1, seats: 4 }, { id: 2, seats: 2 }]);
            } else if (collection === 'groups' && condition === 'is_traveling') {
                return Promise.resolve([{ id: 1, people: 5 }]);
            }

            jest.spyOn(mockRepository, 'insertItem').mockResolvedValue(undefined);
            jest.spyOn(mockRepository, 'updateFieldItemById').mockResolvedValue(undefined);

            const response = await request(app)
                .post('/dropoff')
                .send(dropOffData)
                .set('Content-Type', 'application/x-www-form-urlencoded');

            expect(response.status).toBe(HTTP_STATUS_CODE.OK);
        });
    });

    it('should respond with status 400 when a dropoff param was unknown', async () => {
        const dropOffData = 'ID=2';

        const response = await request(app)
            .post('/dropoff')
            .send(dropOffData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        expect(response.status).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    });

    it('should respond with status 200 when a dropoff was executed successfully', async () => {
        jest.spyOn(mockRepository, 'removeItemByField').mockResolvedValue(undefined);
        jest.spyOn(mockRepository, 'getItemsByCondition').mockImplementation(async (collection, condition) => {
            const dropOffData = 'ID=1';
            if (collection === 'cars' && condition === 'is_available') {
                return Promise.resolve([{ id: 1, seats: 4 }, { id: 2, seats: 2 }]);
            } else if (collection === 'groups' && condition === 'is_traveling') {
                return Promise.resolve([{ id: 1, people: 5 }]);
            }

            jest.spyOn(mockRepository, 'insertItem').mockResolvedValue(undefined);
            jest.spyOn(mockRepository, 'updateFieldItemById').mockResolvedValue(undefined);

            const response = await request(app)
                .post('/dropoff')
                .send(dropOffData)
                .set('Content-Type', 'application/x-www-form-urlencoded');

            expect(response.status).toBe(HTTP_STATUS_CODE.OK);
        });
    });

    it('should respond with status 200 when a locate was executed successfully', async () => {
        jest.spyOn(mockRepository, 'getItemByField').mockImplementation(async (collection, condition) => {
            const dropOffData = 'ID=1';
            if (collection === 'journeys' && condition === 'group') {
                return Promise.resolve({ id: 1, group: 1, car: 1 });
            } else if (collection === 'cars' && condition === 'id') {
                return Promise.resolve([{ id: 1, seats: 5, is_available: false }]);
            }
            const response = await request(app)
                .post('/locate')
                .send(dropOffData)
                .set('Content-Type', 'application/x-www-form-urlencoded');

            expect(response.status).toBe(HTTP_STATUS_CODE.OK);
            console.log(response.body)
        });
    });

    it('should respond with status 400 when a locate header was unknown', async () => {
        const locateParam = 'ID=2';

        const response = await request(app)
            .post('/locate')
            .send(locateParam)
            .set('Content-Type', 'application/x-www-form-urlencoded11111');

        expect(response.status).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    });


});
