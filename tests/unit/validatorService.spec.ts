import { ValidationService, LoggerService } from '@services';
import { Request } from 'express';
import { ValidationError } from '@model/error';
import { CarData, GroupData } from '@models';

jest.mock('../../src/domain/services/loggerService');

describe('validateHeaders', () => {
    it('should validate headers successfully', () => {
        const req = {
            headers: {
                'Content-Type': 'application/json',
            }
        } as unknown as Request;

        const headersToValidate = {
            'Content-Type': 'application/json',
        };

        expect(() => ValidationService.validateHeaders(req, headersToValidate)).not.toThrow();
    });

    it('should throw ValidationError if header does not match', () => {
        const req = {
            headers: {
                'Content-Type': 'application/json',
            }
        } as unknown as Request;

        const headersToValidate = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };


        expect(() => ValidationService.validateHeaders(req, headersToValidate)).toThrow(ValidationError);
    });
});

describe('validateBody', () => {
    const logger = {
        error: jest.fn(),
    };

    beforeAll(() => {
        (LoggerService.getInstance as jest.Mock).mockReturnValue(logger);
    });

    it('should validate body successfully with correct schema', () => {
        const body = [
            {
                id: 1,
                seats: 4,
            },
            {
                id: 2,
                seats: 6,
            }
        ];

        const schema: CarData = {
            id: 2,
            seats: 0,
        };

        expect(() => ValidationService.validateBody(body, schema, true)).not.toThrow();
    });

    it('should throw ValidationError if body is empty', () => {
        const body = {}

        const schema: CarData = {
            id: 2,
            seats: 0,
        };

        expect(() => ValidationService.validateBody(body, schema, true)).toThrow(ValidationError);
    });

    it('should throw ValidationError if a required property is missing', () => {
        const body = [
            {
                id: 1,
                seats: 4,
            },
            {
                id: 2,
                seat: 6,  // The correct name is seats
            }
        ];

        const schema: CarData = {
            id: 2,
            seats: 0,
        };

        expect(() => ValidationService.validateBody(body, schema, true)).toThrow(ValidationError);
        expect(logger.error).toHaveBeenCalledWith('Property "elem[1].seats" not available');
    });

    it('should throw ValidationError if a property type does not match', () => {
        const body = [
            {
                id: 1,
                seats: 4,
            },
            {
                id: 2,
                seats: 'a lot',
            }
        ];

        const schema: CarData = {
            id: 2,
            seats: 0,
        };

        expect(() => ValidationService.validateBody(body, schema, true)).toThrow(ValidationError);
        expect(logger.error).toHaveBeenCalledWith('Property "elem[1].seats" must be "number", but is "string".');
    });

    it('should throw ValidationError if validateArray is false but the body is an array', () => {
        const body = [
            {
                id: 1,
                people: 4,
            },
            {
                id: 2,
                people: 6,
            }
        ];

        const schema: GroupData = {
            id: 2,
            people: 0,
        };

        expect(() => ValidationService.validateBody(body, schema, false)).toThrow(ValidationError);
    });
});
