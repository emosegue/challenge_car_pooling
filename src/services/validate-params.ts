import { Request } from 'express'
import LoggerSingleton from '../util/logger';
import { ValidationError } from '@model/error';

export function validateHeaders(req: Request, headersToValidate: Record<string, string>) {
    const headers = req?.headers;

    for (const key in headersToValidate) {
        if (headersToValidate.hasOwnProperty(key)) {
            if (headers[key] !== headersToValidate[key]) {
                throw new ValidationError(`Unexpected header value ${headers[key]}`);
            }
        }
    }
}

export function validateBody<T>(body: any, schema: T) {
    const logger = LoggerSingleton.getInstance();

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

    if (Array.isArray(body)) {
        body.forEach((item, index) => {
            validateObject(item, schema, `elemento[${index}]`);
        });
    } else {
        validateObject(body, schema);
    }

};
