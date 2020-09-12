/**
 * @file disconnect.js
 * @description BDOBot Discord Bot Disconnect Event.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const logger = require("../utils/logger").logger;
module.exports = client => {
  logger.info("BDOBot Client Is Disconnected!");
  client.jobs.forEach(job => {
    const jobhandle = client.jobhandles.get(job.name);
    job.close(jobhandle);
  });
};
