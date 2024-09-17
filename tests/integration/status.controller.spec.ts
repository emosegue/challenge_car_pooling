import { StatusController } from '@controllers';
import request from 'supertest';
import express from 'express';
import { HTTP_STATUS_CODE } from '@constants';
import { FirebaseJourneyRepository } from '@firebase/repository';

jest.mock('@firebase/repository', () => {
    return {
        FirebaseJourneyRepository: jest.fn().mockImplementation(() => ({
            testConnection: jest.fn(),
        })),
    };
});

const app = express();
app.use(express.json());

const mockRepository = new FirebaseJourneyRepository();
const statusController = new StatusController(mockRepository);
app.get('/status', (req, res, next) => statusController.checkStatus(req, res, next));


describe('StatusController Integration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with status 200 when all works fine', async () => {
        jest.spyOn(mockRepository, 'testConnection').mockResolvedValue(undefined);

        const response = await request(app)
            .get('/status')
            .set('content-type', 'application/json');

        expect(response.status).toBe(HTTP_STATUS_CODE.OK);
        expect(response.body.message).toBe('System is healthy')
    });

    it('should respond with status 500 when testConnection fails', async () => {
        jest.spyOn(mockRepository, 'testConnection').mockRejectedValue(new Error('Test connection failed'));

        const response = await request(app)
            .get('/status')
            .set('content-type', 'application/json');

        expect(response.status).toBe(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

});

