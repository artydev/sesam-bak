const sql = require('mssql')
const nano = require('nano')('http://localhost:5984');


const queryTable = [
//     {
//         table:'dossiers',
//         query:'select * from DOSSIER',
//         idField: 'DOSSIER_IDENT'
// },
{
    table:'visites',
    query:'select * from VISITE left join ETABLISSEMENT_OBSERVE on  ETABLISSEMENT_OBSERVE.ETOB_IDENT = VISITE.ETOB_IDENT',
    idField: 'VISITE_IDENT'

},
{
    table:'controles',
    query:'select * from CONTROLE ',
    idField: 'CONTROLE_IDENT'
}
];

let main = async () => {
    try {
        // await sql.connect('mssql://sesameTestApp:16amTsTApp!@devirissql\\MSSQL_TSTIRIS/DATAWH');
        await sql.connect('mssql://sa:password1&@localhost:1433/STG_IrisSora');
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