const {couchdb_url} = require('../config');
const nano = require('nano')(couchdb_url);
const js2xmlparser = require('js2xmlparser');
const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const crypto = require("crypto");
const config = require('../config');

var options = {
    declaration: {
        encoding: "UTF-8",
        version: "1.1"
    }
};

let getDeleteDate = ()=>{
    let today = new Date(2019,08,31);
    today.setDate(today.getDate()+config.job.number_of_day);
    console.log(today);
    console.log(today.toJSON())
    return today.toJSON()
}
getDeleteDate()

let getVisitesWithInfos = async () => {
    let newVisitesDb = nano.use('new-visites');
    let newControlesDb = nano.use('new-controles');
    let documentDb = nano.use('documents');
    let visitesToBeSync = await newVisitesDb.find({selector:{toBeSync: true,}})
                                .then(list => list.docs);
    let updatedVisites = visitesToBeSync.map(visite => ({...visite,new_visite:false, toBeDeletedAt:getDeleteDate()}));
    await newVisitesDb.bulk({docs:updatedVisites});
    visitesToBeSync = visitesToBeSync.map(async visite =>{
        let controles = await newControlesDb.find({selector:{VISITE_IDENT: visite.VISITE_IDENT}}).then(list=>list.docs);
        let documents = await documentDb.find({selector: {visite: { $elemMatch: {$eq: visite.VISITE_IDENT }}}}).then(list=>list.docs);
        return {...visite,trame:undefined,"ACTIONS":{"ACTION":controles}, "FICHIERS" : {"FICHIER": documents} }
    } )
    return Promise.all(visitesToBeSync);
}


module.exports.writeXmlFiles = async (path) =>{
    let options = { 
        declaration: {
            encoding: "UTF-8",
            version: "1.0"
    }}

    let visites = await getVisitesWithInfos();

    let xmlVisites = visites.map(visite => js2xmlparser.parse("VISITE",visite, options));


    await Promise.all(xmlVisites.map(xmlcontent =>writeFile(path+crypto.randomBytes(10).toString('hex')+'.xml',xmlcontent )))
}