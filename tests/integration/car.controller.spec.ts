import { CarController } from '@controllers';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS_CODE } from '@constants';
import { FirebaseJourneyRepository } from '@firebase/repository';

jest.mock('@firebase/repository', () => {
    return {
        FirebaseJourneyRepository: jest.fn().mockImplementation(() => ({
            removeAllItems: jest.fn(),
            insertBulkItems: jest.fn()
        })),
    };
});

const app = express();
app.use(express.json());

const mockRepository = new FirebaseJourneyRepository();
const carController = new CarController(mockRepository);
app.put('/cars', (req, res, next) => carController.reloadCars(req, res, next));

describe('CarController Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with status 200 when cars are reloaded successfully', async () => {
        const carData = [{ id: 1, seats: 4 }, { id: 2, seats: 2 }];

        jest.spyOn(mockRepository, 'removeAllItems').mockResolvedValue(undefined);
        jest.spyOn(mockRepository, 'insertBulkItems').mockResolvedValue(undefined);

        const response = await request(app)
            .put('/cars')
            .send(carData)
            .set('content-type', 'application/json');

        expect(response.status).toBe(HTTP_STATUS_CODE.OK);
    });

    it('should respond with status 400 because body was malformed', async () => {
        const carData = [{ id: 1, seats: 4 }, { id2: 2, seats: 2 }];

        jest.spyOn(mockRepository, 'removeAllItems').mockResolvedValue(undefined);
        jest.spyOn(mockRepository, 'insertBulkItems').mockResolvedValue(undefined);

        const response = await request(app)
            .put('/cars')
            .send(carData)
            .set('content-type', 'application/json');

        expect(response.status).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    });


    it('should respond with status 500 because some internal error was happened', async () => {
        const carData = [{ id: 1, seats: 4 }, { id: 2, seats: 2 }];

        jest.spyOn(mockRepository, 'removeAllItems').mockRejectedValue(new Error('Unexpected error'));

        const response = await request(app)
            .put('/cars')
            .send(carData)
            .set('content-type', 'application/json');

        expect(response.status).toBe(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    });
});