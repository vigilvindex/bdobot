/**
 * @file error.js
 * @description BDOBot Discord Bot Error Event.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const logger = require('../utils/logger').logger;
module.exports = (client, error) => {
    logger.error(`BDOBot Client Error: ${error}`);
};
