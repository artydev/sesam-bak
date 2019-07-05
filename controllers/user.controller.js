const sql = require('mssql');
const config = require('../config');

module.exports.getUserById = async (id) => {
  let query = `select * from AGENT_DD 
  where AGENT_DD_IDENT > 4500 and AGENT_DD_IDENT<5000 and AGENT_DD_IDENT = ${id}`
  try{
    await sql.connect(config.sql_db_url);
    let response = await sql.query(query)
    sql.close()
    return response.recordsets[0]
  }catch(err){
    sql.close();throw err
  }
}