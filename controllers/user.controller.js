const {sql} = require('../sql');

module.exports.getUserById = async (id) => {
  let query = `select * from AGENT_DD where AGDD_LOGIN_NT = '${id}'`
    let response = await sql.query(query)
    return response.recordsets[0]
}