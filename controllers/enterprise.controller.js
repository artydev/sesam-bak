const {sql} = require('../sql');


module.exports.getTopEnterpriseBySearch = async (searchQuery,k=10) => {
  let query = `select TOP(${k}) ETOB_IDENT, ETOB_ENSEIGNE_LIB, ETOB_SIRET,ETOB_RAISON_SOCIALE 
    from ETABLISSEMENT_OBSERVE 
    where (ETOB_RAISON_SOCIALE like '%${searchQuery}%' and ETOB_RAISON_SOCIALE IS NOT NULL)
      or (ETOB_ENSEIGNE_LIB like '%${searchQuery}%' and ETOB_ENSEIGNE_LIB IS NOT NULL)
      or (ETOB_SIRET like '${searchQuery}%' and ETOB_SIRET IS NOT NULL)`

    let response = await sql.query(query);
    return response.recordsets[0];
}

module.exports.getVisitesByEntreprise = async (ETOB_IDENT) => {
  let visiteQuery = `select * from VISITE
  where ETOB_IDENT = ${ETOB_IDENT}
  order by VISITE_DATE_INTERVENTION desc`
  let visites = await sql.query(visiteQuery).then(response => response.recordsets[0]);
  for (let visite of visites){
    let controleQuery = `select * from CONTROLE 
    where VISITE_IDENT = ${visite.VISITE_IDENT}`
    visite.controles = await sql.query(controleQuery).then(response => response.recordsets[0]);;
  }
  return visites
}

module.exports.getEnterpriseById = async (id) => {
  let query = `select ETOB_ADR1,ETOB_ADR2,ETOB_ADR3,ETOB_IDENT, ETOB_SIRET,
   ETOB_ENSEIGNE_LIB, ETOB_RAISON_SOCIALE, ETOB_ADRCP, ETOB_ADRVILLE,NAF_LIBELLE
   from ETABLISSEMENT_OBSERVE where ETOB_IDENT = ${id}`
    let response = await sql.query(query)
    return response.recordsets[0]
}