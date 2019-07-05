const sql = require('mssql');
const config = require('../config');


module.exports.getTopEnterpriseBySearch = async (searchQuery,k=10) => {
  let query = `select TOP(${k}) ETOB_IDENT, ETOB_ENSEIGNE_LIB, ETOB_SIRET,ETOB_RAISON_SOCIALE 
    from ETABLISSEMENT_OBSERVE 
    where (ETOB_RAISON_SOCIALE like '%${searchQuery}%' and ETOB_RAISON_SOCIALE IS NOT NULL)
      or (ETOB_ENSEIGNE_LIB like '%${searchQuery}%' and ETOB_ENSEIGNE_LIB IS NOT NULL)
      or (ETOB_SIRET like '%${searchQuery}%' and ETOB_SIRET IS NOT NULL)`
  try{
    await sql.connect(config.sql_db_url);
    let response = await sql.query(query);
    sql.close();
    return response.recordsets[0];
  }catch(err){
    sql.close(); throw err;
  }
}

module.exports.getEnterpriseById = async (id) => {
  let query = `select * from ETABLISSEMENT_OBSERVE where ETOB_IDENT = ${id}`
  try{
    await sql.connect(config.sql_db_url);
    let response = await sql.query(query)
    sql.close()
    return response.recordsets[0]
  }catch(err){
    sql.close();throw err
  }
}