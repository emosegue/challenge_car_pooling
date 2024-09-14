import { Logger, ILogObj } from 'tslog';

class LoggerSingleton {
    private static instance: Logger<ILogObj>;

    private constructor() {
        LoggerSingleton.instance = new Logger({ name: 'car-pooling' });
    }

    public static getInstance(): Logger<ILogObj> {
        if (!LoggerSingleton.instance) {
            LoggerSingleton.instance = new Logger({ name: 'car-pooling' });
        }
        return LoggerSingleton.instance;
    }
}

export default LoggerSingleton;