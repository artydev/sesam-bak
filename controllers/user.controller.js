const {connectSql,closeSql} = require('../sql');


module.exports.getUserById = async (id) => {
  let sql = await connectSql();  let query = `select * from AGENT_DD where AGDD_LOGIN_NT = '${id}'`;
  let response = await sql.query(query);
  closeSql();
  return response.recordsets[0];
}