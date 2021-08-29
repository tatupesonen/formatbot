import winston from 'winston';
const colorizer = winston.format.colorize();

const formatBotFormat = winston.format.printf(
  ({ level, message, timestamp }) => {
    const msg = `${timestamp} [${level}]: ${message} `;
    return msg;
  }
);

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'formatbot' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
        formatBotFormat
      ),
    }),
    new winston.transports.File({
      filename: 'logs/formatbot.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});
