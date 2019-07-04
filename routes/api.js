const entrepriseRouter = require('./entreprise.route');

module.exports = function(app) {
  app.use('/entreprise', entrepriseRouter);
};
