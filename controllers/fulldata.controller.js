const sql = require('mssql')
const nano = require('nano')('http://localhost:5984');
const config = require('../config');

const queryTable2 = [
    {
        table:'dossiers',
        query:`select * from DOSSIER
        join TACHE_PROGRAMMEE on TACHE_PROGRAMMEE.TAPR_IDENT = DOSSIER.TAPR_IDENT
        where RESPONSABLE_AGENT_DD_IDENT > 4500 and RESPONSABLE_AGENT_DD_IDENT<5000`,
        idField: 'DOSSIER_IDENT'
},
];
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
    try{
        // await sql.connect('mssql://sesameTestApp:16amTsTApp!@devirissql\\MSSQL_TSTIRIS/DATAWH');
        await sql.connect(config.sql_db_url);
        let response = {}
        let {query,table,idField} = getQueryTable(idAgent)[tableKey]
        let recordsets = await sql.query(query);
        response[table] = recordsets['recordsets'][0]
        sql.close();
        return response;
    }catch(err){
        sql.close();throw err
    }
} 
