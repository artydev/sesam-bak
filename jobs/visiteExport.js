const {couchdb_url} = require('../config');
const nano = require('nano')(couchdb_url);
const js2xmlparser = require('js2xmlparser');
const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const crypto = require("crypto");
const config = require('../config');


let getDeleteDate = ()=>{
    let today = new Date();
    today.setDate(today.getDate()+config.job.number_of_day);
    return today.toJSON()
}

let writeXmlFiles = async (path,visites) =>{
    let options = { 
        declaration: {
            encoding: "UTF-8",
            version: "1.0"
    }}

    let xmlVisites = visites.map(visite => js2xmlparser.parse("VISITE",visite, options));
    await Promise.all(xmlVisites.map(xmlcontent =>writeFile(path+crypto.randomBytes(10).toString('hex')+'.xml',xmlcontent )))
}

module.exports.exportVisitesWithInfos = async (writePath) => {
    let newVisitesDb = nano.use('new-visites');
    let newControlesDb = nano.use('new-controles');
    let documentDb = nano.use('documents');
    let visitesToBeSync = await newVisitesDb.find({selector:{toBeExported: true,}})
                                .then(list => list.docs);
    let visitesWithFullInfo =  await Promise.all(visitesToBeSync.map(async visite =>{
        let controles = await newControlesDb.find({selector:{VISITE_IDENT: visite.VISITE_IDENT}}).then(list=>list.docs.map(controle=>({...controle,trame:undefined})));
        let documents = await documentDb.find({selector: {visite: { $elemMatch: {$eq: visite.VISITE_IDENT }}}})
                                .then(list=>list.docs.filter(doc => doc.categorie == 'photo' || doc.categorie == 'joint'));
        return {...visite,trame:undefined,"ACTIONS":{"ACTION":controles}, "FICHIERS" : {"FICHIER": documents} }
    } ))
    await writeXmlFiles(writePath,visitesWithFullInfo);

    let updatedVisites = visitesToBeSync.map(visite => ({...visite,toBeExported: false, toBeDeletedAt:getDeleteDate()}));
    await newVisitesDb.bulk({docs:updatedVisites});
}
