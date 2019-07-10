const sql = require('mssql');
const config  = require('./config');


let startSql = () => sql.connect({
    ...config.sql_config,
    requestTimeout : 25000
  });

module.exports = {startSql, sql}