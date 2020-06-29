import winston from "winston";

const { combine, colorize, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), myFormat),
    }),
  ],
});

if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: combine(timestamp(), myFormat),
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: "combined.log",
      format: combine(timestamp(), myFormat),
    }),
  );
}

export default logger;
