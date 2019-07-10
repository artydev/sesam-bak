const {couchdb_url} = require('../config');
const nano = require('nano')(couchdb_url);
const js2xmlparser = require('js2xmlparser');

var options = {
    declaration: {
        encoding: "UTF-8",
        version: "1.1"
    }
};

let getVisiteWithInfos = async () => {
    let newVisitesDb = nano.use('new-visites');
    let newControlesDb = nano.use('new-controles');
    let documentDb = nano.use('documents');
    newVisitesDb
    let visitesToBeSync = await newVisitesDb.find({selector:{toBeSync: true}})
                                .then(list => list.docs);
    visitesToBeSync = visitesToBeSync.map(async visite =>{
        let controles = await newControlesDb.find({selector:{VISITE_IDENT: visite.VISITE_IDENT}}).then(list=>list.docs);
        let documents = await documentDb.find({selector: {visite: { $elemMatch: {$eq: visite.VISITE_IDENT }}}}).then(list=>list.docs);
        return {...visite,"ACTIONS":{"ACTION":controles}, "FICHIERS" : {"FICHIER": documents} }
    } )
    return Promise.all(visitesToBeSync);
}

module.exports.writeXmlFiles = async () =>{
    let options = { 
        declaration: {
            encoding: "UTF-8",
            version: "1.0"
    }}
    let visites = await getVisiteWithInfos();
    let xmlcontent = js2xmlparser.parse("VISITE",visites, options)
    return xmlcontent;
}