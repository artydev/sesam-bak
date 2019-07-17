const log4js = require('log4js');
log4js.configure({
  appenders: { log: { type: 'file', filename: 'debug.log' } },
  categories: { default: { appenders: ['log'], level: 'info' } }
});
 
const logger = log4js.getLogger('log');

module.exports = logger;