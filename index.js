var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const registerRoutes = require('./routes/api');
const {registerJob} = require('./jobs');
const {port} = require('./config');
const logger = require('./logger');
try{
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
  
  registerJob()
  
  registerRoutes(app);
  
  app.listen(port);
  
  logger.info('Started on port ' + port);
}catch(err){
  logger.error("Error at starting "+ err)
}
