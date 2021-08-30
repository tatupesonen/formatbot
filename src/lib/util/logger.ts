import winston from 'winston';
import DailyRotateFile, {
  DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file';

const formatBotFormat = winston.format.printf(
  ({ level, message, timestamp }) => {
    const msg = `${timestamp} [${level}]: ${message} `;
    return msg;
  }
);

const dailyRotateTransportOpts: DailyRotateFileTransportOptions = {
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
};

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
        formatBotFormat
      ),
    }),
    // File transport for readable output
    new DailyRotateFile({
      ...dailyRotateTransportOpts,
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        formatBotFormat
      ),
    }),
    new winston.transports.File({
      filename: 'logs/json.log',
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});
