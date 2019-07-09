const {couchdb_url} = require('../config');
const nano = require('nano')(couchdb_url);

var options = {
    declaration: {
        encoding: "UTF-8",
        version: "1.1"
    }
};

let getVisiteWithInfos = async () => {
    let newVisitesDb = nano.use('new-visites');
    let newControlesDb = nano.use('new-controles');
    let visitesToBeSync = await (newVisitesDb.list()).docs.filter(doc => doc.toBeSync);
    for (let visite of visitesToBeSync){
        await newControlesDb.find({})
    }
}