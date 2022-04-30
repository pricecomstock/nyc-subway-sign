import winston from "winston";

const { format } = winston;

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export default logger;
