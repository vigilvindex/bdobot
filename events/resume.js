/**
 * @file resume.js
 * @description BDOBot Discord Bot Resume Event.
 * @author VigilVindex <vigil.vindex@gmail.com>
 * @license CC-BY-SA-4.0
 * @version 0.0.1
 */
const logger = require('../utils/logger').logger;
module.exports = (client) => {
    logger.info('BDOBot Client Has Resumed!');
    client.user.setUsername('BDOBot');
    client.user.setActivity('Black Desert Online', { type: 'PLAYING' })
        .then(logger.info('BDOBot Client Activity Set!'))
        .catch(logger.error);
    client.jobs.forEach(job => {
        const jobhandle = job.execute(client);
        client.jobhandles.set(job.name, jobhandle);
    });
};
