const {execSql} = require('../sql');

const getQueryTable = (idAgent) => {  
  return {
      cpf: {
          table:'produit-cpf',
          query:`select * from PRODUIT_CPF`,
          idField: 'CPF_IDENT'
      },
      activite:{
          table:'activite',
          query:`select * from ACTIVITE_DG`,
          idField: 'ACDG_IDENT'
      },
      _dossiers: {
          table:'dossiers',
          query:`select * from DOSSIER AS D
          join TACHE_PROGRAMMEE on TACHE_PROGRAMMEE.TAPR_IDENT = D.TAPR_IDENT
          where RESPONSABLE_AGENT_DD_IDENT = ${idAgent} 
          and D.DOSSIER_DATE_ENREG >=  DATEADD(YEAR,-2,GETDATE())`,
          idField: 'DOSSIER_IDENT'
		},
	    dossiers: {
          table:'dossiers',
          query:`SELECT d.*,T.*  FROM dossier AS d
			INNER JOIN tache_programmee as T on d.tapr_ident =t.tapr_ident 
			INNER JOIN AGDD_DOSSIER as AG on AG.DOSSIER_IDENT = d.DOSSIER_IDENT
			WHERE AGENT_DD_IDENT = ${idAgent}
			AND DOSSIER_FLAG_CLOTURE = 0`,
          idField: 'DOSSIER_IDENT'
      },
      visites: {
          table:'visites',
          query:`select * from VISITE AS V
          left join ETABLISSEMENT_OBSERVE 
          on  ETABLISSEMENT_OBSERVE.ETOB_IDENT = V.ETOB_IDENT
          where AGENT_DD_IDENT = ${idAgent}
          and V.VISITE_DATE_INTERVENTION >=  DATEADD(YEAR,-2,GETDATE())
          order by V.VISITE_DATE_INTERVENTION DESC`,
          idField: 'VISITE_IDENT'

      },
      controles : {
          table:'controles',
          query:`select * from CONTROLE 
          where AGENT_DD_IDENT = ${idAgent}
          and VISITE_DATE_INTERVENTION >= DATEADD(YEAR,-2,GETDATE())`,
          idField: 'CONTROLE_IDENT'
      }
    }
};

module.exports =  getDataByUserId = async (tableKey,idAgent) => {
        // await sql.connect('mssql://sesameTestApp:16amTsTApp!@devirissql\\MSSQL_TSTIRIS/DATAWH');
        let {query,idField} = getQueryTable(idAgent)[tableKey]
        let recordsets =  await execSql(query);
        let response = recordsets['recordsets'][0].map(doc => ({...doc, _id: doc[idField].toString()}));
        return response;
} 
