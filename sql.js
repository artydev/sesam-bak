const sql = require('mssql');
const config  = require('./config');


exports.execSql = async function(sqlquery) {
  const pool = new sql.ConnectionPool(config.sql_config);
  pool.on('error', err => {
    // ... error handler 
    console.log('sql errors', err);
  });

  try {
    await pool.connect();
    let result = await pool.request().query(sqlquery);
    pool.close(); //closing connection after request is finished.
    return result;
  } catch (err) { 
      throw err
  } finally {
    pool.close(); //closing connection after request is finished.
  }
};
