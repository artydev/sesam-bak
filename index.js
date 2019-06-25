var express = require('express');
var app = express();
var bodyParser = require('body-parser');

const registerRoutes = require('./routes/api');

const config = require('./config');

const sql = require('mssql');

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

sql.connect(config, function(err) {
  if (err) throw new Error('Connection to database failed');
  else console.log('Connection to database ok!');
});

app.listen(port);

console.log('Started on port ' + port);
