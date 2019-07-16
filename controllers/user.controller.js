const {execSql} = require('../sql');


module.exports.getUserById = async (id) => {
  let query = `select * from AGENT_DD where AGDD_LOGIN_NT = '${id}'`;
  let response =  await execSql(query);
  return response.recordsets[0];
}