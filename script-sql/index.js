const sql = require('mssql')
const nano = require('nano')('http://localhost:5984');
const config = require('./config');

const queryTable = [
    {
        table:'dossiers',
        query:`select * from DOSSIER
        join TACHE_PROGRAMMEE on TACHE_PROGRAMMEE.TAPR_IDENT = DOSSIER.TAPR_IDENT
        where RESPONSABLE_AGENT_DD_IDENT > 4500 and RESPONSABLE_AGENT_DD_IDENT<5000`,
        idField: 'DOSSIER_IDENT'
},
];
const queryTable2 = [
        {
            table:'produit-cpf',
            query:`select * from PRODUIT_CPF`,
            idField: 'CPF_IDENT'
    },
    {
        table:'activite',
        query:`select * from ACTIVITE_DG`,
        idField: 'ACDG_IDENT'
    },
    {
        table:'dossiers',
        query:`select * from DOSSIER
        join TACHE_PROGRAMMEE on TACHE_PROGRAMMEE.TAPR_IDENT = DOSSIER.TAPR_IDENT
        where RESPONSABLE_AGENT_DD_IDENT > 4500 and RESPONSABLE_AGENT_DD_IDENT<5000`,
        idField: 'DOSSIER_IDENT'
},
{
    table:'visites',
    query:`select * from VISITE 
    left join ETABLISSEMENT_OBSERVE 
    on  ETABLISSEMENT_OBSERVE.ETOB_IDENT = VISITE.ETOB_IDENT
    where AGENT_DD_IDENT > 4500 and AGENT_DD_IDENT<5000`,
    idField: 'VISITE_IDENT'

},
{
    table:'controles',
    query:`select * from CONTROLE 
    where AGENT_DD_IDENT > 4500 and AGENT_DD_IDENT<5000`,
    idField: 'CONTROLE_IDENT'
}
];

let main = async () => {
    try {
        // await sql.connect('mssql://sesameTestApp:16amTsTApp!@devirissql\\MSSQL_TSTIRIS/DATAWH');
        await sql.connect(config.sql_db_url);
        console.log("connected")
        for (let {query,table,idField} of queryTable){
        await copyDBwithSQLChunks(query,table,idField);
            console.log(table+" succes");
        }
    } catch (err) {
        console.log(err)
    }
} 

let copyDBwithSQLChunks = (query,tableName,idField) =>{
    return new Promise( (resolve,reject) => {
        const request = new sql.Request()
        request.stream = true
        request.query(query);

        let rowsToProcess = [];
        sql.on('error', reject);

        request.on('row', row => {
            rowsToProcess.push(row);
            if (rowsToProcess.length >= 100000) {
                request.pause();
                processRows();
            }
        });

        request.on('done', () => {
            processRows().then(resolve);
        });

        async function processRows() {
            try{
                let table = await nano.use(tableName);
                await table.bulk({docs:rowsToProcess.map(doc => ({...doc, _id: doc[idField].toString()}))});
                rowsToProcess = [];
                request.resume();
            }catch(err){
                err.request = undefined;
                reject(err);
            }
        }
    })

}

main();