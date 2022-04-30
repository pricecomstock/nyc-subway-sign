import winston from "winston";
import { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } from "../config.js";
import { TelegramTransport } from "./telegram.js";

const { format } = winston;

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple()
      ),
    }),
  ],
});

if (
  TELEGRAM_TOKEN &&
  TELEGRAM_CHAT_ID &&
  process.env.NODE_ENV === "production"
) {
  logger.add(
    new TelegramTransport({
      level: "warn",
      token: TELEGRAM_TOKEN,
      chatId: TELEGRAM_CHAT_ID,
    })
  );
}

export default logger;
