import winston from "winston";

const logger = winston.createLogger({
  level: "error", // you can adjust level for info, warn, etc.
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack || ""}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "./logs/error.log" }), // all errors will go here
  ],
});

export default logger;