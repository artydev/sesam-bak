const {couchdb_url} = require('../config');
const nano = require('nano')(couchdb_url);


let deleteDocuments = async (table,query) =>{
    let docsToBeDeleted = await table.find({selector:query})
                                .then(list => list.docs);
    console.log(docsToBeDeleted);
    let deletedVisites = docsToBeDeleted.map(visite => ({_id:visite._id,_rev:visite._rev, _deleted:true}));
    await table.bulk({docs:deletedVisites});
    return docsToBeDeleted;
}

module.exports.deleteSynchronizedVisites = async () => {
    let newVisitesDb = nano.use('new-visites');
    let newControlesDb = nano.use('new-controles');
    let documentDb = nano.use('documents');
    let visitesToBeDeleted = await deleteDocuments(newVisitesDb,{ $and:[{toBeDeletedAt:{$exists:true}}, {toBeDeletedAt:{$lte:new Date().toJSON()}}]});

    visitesToBeDeleted.map(async visite =>{
        await deleteDocuments(newControlesDb,{VISITE_IDENT: visite.VISITE_IDENT}).then(list=>list.docs);
        let documents = await documentDb.find({selector: {visite: { $elemMatch: {$eq: visite.VISITE_IDENT }}}}).then(list=>list.docs);
        let deletedDocuments = documents.map(doc=>{
            if (doc.visite.length ==1){
                return {_id: doc._id,_rev: doc._rev, _deleted:true}
            }
            var index = doc.visite.indexOf(visite.VISITE_IDENT);
            if (index > -1) {
                doc.visite.splice(index, 1);
            }
            return doc
        })
        console.log(deletedDocuments)
        await documentDb.bulk({docs:deletedDocuments});
    } )
    return Promise.all(visitesToBeDeleted);
}