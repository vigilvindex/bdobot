/**
 * @file debug.js
 * @description BDOBot Discord Bot Debug Event.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const logger = require("../utils/logger").logger;
module.exports = (client, error) => {
  if (client.config.debug) {
    logger.error(`BDOBot Client Debug: ${error}`);
  }
};
