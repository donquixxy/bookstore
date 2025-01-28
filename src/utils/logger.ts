import winston from 'winston';
import caller from 'caller';

class Logger {
    private static instance: Logger;
    private logger: winston.Logger;

    private constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message, stack }) => {
                            // Capture file and line number information
                            const callerFile = caller();
                            const logMessage = `[${timestamp}] [${level}] ${message} (at ${callerFile})`;
                            return logMessage;
                        })
                    )
                }),
                new winston.transports.File({
                    filename: 'error.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json(),
                        winston.format.printf(({ timestamp, level, message, stack }) => {
                            // Include file and line number in the logs
                            const callerFile = caller();
                            const logMessage = { timestamp, level, message, caller: callerFile };
                            return JSON.stringify(logMessage);
                        })
                    )
                })
            ]
        });
    }

    public static getLogger() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log(level: string, message: string): void {
        this.logger.log(level, message);
    }
}

export default Logger.getLogger();
