import { Logger, ILogObj } from 'tslog';

export class LoggerService {
    private static instance: Logger<ILogObj>;

    private constructor() {
        LoggerService.instance = new Logger({ name: 'car-pooling' });
    }

    public static getInstance(): Logger<ILogObj> {
        if (!LoggerService.instance) {
            LoggerService.instance = new Logger({ name: 'car-pooling' });
        }
        return LoggerService.instance;
    }
}