const {sql} = require('../sql');
const {connectSql,closeSql} = require('../sql');


const getQueryTable = (idAgent) => ({
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
        dossiers: {
            table:'dossiers',
            query:`select * from DOSSIER
            join TACHE_PROGRAMMEE on TACHE_PROGRAMMEE.TAPR_IDENT = DOSSIER.TAPR_IDENT
            where RESPONSABLE_AGENT_DD_IDENT = ${idAgent}`,
            idField: 'DOSSIER_IDENT'
        },
        visites: {
            table:'visites',
            query:`select * from VISITE 
            left join ETABLISSEMENT_OBSERVE 
            on  ETABLISSEMENT_OBSERVE.ETOB_IDENT = VISITE.ETOB_IDENT
            where AGENT_DD_IDENT = ${idAgent}`,
            idField: 'VISITE_IDENT'

        },
        controles : {
            table:'controles',
            query:`select * from CONTROLE 
            where AGENT_DD_IDENT = ${idAgent}`,
            idField: 'CONTROLE_IDENT'
        }
    });

module.exports =  getDataByUserId = async (tableKey,idAgent) => {
        // await sql.connect('mssql://sesameTestApp:16amTsTApp!@devirissql\\MSSQL_TSTIRIS/DATAWH');
        let sql = await connectSql();
        let {query,idField} = getQueryTable(idAgent)[tableKey]
        let recordsets = await sql.query(query);
        let response = recordsets['recordsets'][0].map(doc => ({...doc, _id: doc[idField].toString()}));
        closeSql();
        return response;
} 
