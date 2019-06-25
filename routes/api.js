const users = require('./users/users.route');

module.exports = function(app) {
  app.use('/users', users);
};
