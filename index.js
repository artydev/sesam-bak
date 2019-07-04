var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const registerRoutes = require('./routes/api');

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

var port = process.env.PORT || 8080;

registerRoutes(app);

app.listen(port);

console.log('Started on port ' + port);
