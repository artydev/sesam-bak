const entrepriseRouter = require('./entreprise.route');
const agentRouter = require('./agent.route');
const fullDataRouter = require('./userFullData.route');


module.exports = function(app) {
  app.use('/entreprise', entrepriseRouter);
  app.use('/agent', agentRouter);
  app.use('/fullData', fullDataRouter);
};
