const entrepriseRouter = require('./entreprise.route');
const agentRouter = require('./agent.route');

module.exports = function(app) {
  app.use('/entreprise', entrepriseRouter);
  app.use('/agent', agentRouter);
};
