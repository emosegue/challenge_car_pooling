import { Request } from 'express'
import { LoggerService } from '@services';
import { ValidationError } from '@exceptions';

export class ValidationService {
    /**
     * Validates that the request headers match the expected values exactly.
     * If any header does not match, a `ValidationError` is thrown.
     * 
     * @param {Request} req - The HTTP request.
     * @param {Record<string, string>} headersToValidate - An object defining the headers and their expected values.
     * @throws {ValidationError} If any header has an unexpected value.
     */
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

    /**
     * Validates that the request headers contain at least one value from an array of expected values.
     * If none of the expected values match, a `ValidationError` is thrown.
     * 
     * @param {Request} req - The HTTP request.
     * @param {Record<string, string[]>} headersToValidate - An object defining the headers and their expected values as arrays.
     * @throws {ValidationError} If none of the header values match the expected values.
     */
    static validateMultipleHeaders(req: Request, headersToValidate: Record<string, string[]>) {
        const headers = req?.headers;

        for (const key in headersToValidate) {
            if (headersToValidate.hasOwnProperty(key)) {
                const expectedValues = headersToValidate[key];
                const actualValue = headers[key];

                if (Array.isArray(actualValue)) {
                    if (!actualValue.some(value => expectedValues.includes(value))) {
                        throw new ValidationError(`Unexpected header value ${actualValue}`);
                    }
                } else {
                    if (!expectedValues.includes(actualValue as string)) {
                        throw new ValidationError(`Unexpected header value ${actualValue}`);
                    }
                }
            }
        }
    }

    /**
     * Validates that the body of the request matches the expected schema.
     * If any property is missing or of an incorrect type, a `ValidationError` is thrown.
     * 
     * @param {any} body - The body of the request to validate.
     * @param {T} schema - The schema to validate against.
     * @param {boolean} validateArray - Whether the body is expected to be an array.
     * @throws {ValidationError} If the body does not match the schema or if it is an empty object/array.
     */
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
