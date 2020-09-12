/**
 * @file warn.js
 * @description BDOBot Discord Bot Warn Event.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const logger = require("../utils/logger").logger;
module.exports = (client, warn) => {
  logger.warn(`BDOBot Client Warning: ${warn}`);
};
