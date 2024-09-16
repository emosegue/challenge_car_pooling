import { Request } from 'express'
import { LoggerService } from '@services';
import { ValidationError } from '@model/error';

export class ValidationService {
    static validateHeaders(req: Request, headersToValidate: Record<string, string>) {
        const headers = req?.headers;

        for (const key in headersToValidate) {
            if (headersToValidate.hasOwnProperty(key)) {
                if (headers[key] !== headersToValidate[key]) {
                    throw new ValidationError(`Unexpected header value ${headers[key]}`);
                }
            }
        }
    }

    static validateBody<T>(body: any, schema: T, validateArray: boolean) {
        const logger = LoggerService.getInstance();

        if (!Object.values(body).length) {
            throw new ValidationError('Error validating input data, body cannot be empty')
        }

        const validateObject = (item: any, schema: T, path = '') => {
            for (const key in schema) {
                const fullPath = path ? `${path}.${key}` : key;

                if (!item.hasOwnProperty(key)) {
                    logger.error(`Property "${fullPath}" not available`);
                    throw new ValidationError('Error validating input data')
                } else if (typeof item[key] !== typeof (schema as any)[key]) {
                    logger.error(`Property "${fullPath}" must be "${typeof (schema as any)[key]}", but is "${typeof item[key]}".`);
                    throw new ValidationError('Error validating input data')
                }
            }
        };

        if (!validateArray && Array.isArray(body)) {
            throw new ValidationError('Error validate input data, body cannot be an array')
        }

        if (Array.isArray(body)) {
            body.forEach((item, index) => {
                validateObject(item, schema, `elem[${index}]`);
            });
        } else {
            validateObject(body, schema);
        }

    };

}
