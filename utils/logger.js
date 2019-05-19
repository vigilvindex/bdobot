/**
 * @file logger.js
 * @description BDOBot Discord Log Utility.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            handleExceptions: true,
            level: env === 'development' ? 'verbose' : 'info',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.align(),
                winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
            ),
        }),
        new (require('winston-daily-rotate-file'))({
            filename: `${logDir}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: env === 'development' ? 'verbose' : 'info',
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.align(),
                winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
            ),
        }),
    ],
    exitOnError: false,
});
module.exports = {
    'logger': logger,
};