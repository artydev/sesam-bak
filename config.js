module.exports = {
    //sql_db_url : 'mssql://sesameTestApp:16amTsTApp!@devirissql\\MSSQL_TSTIRIS/DATAWH',
    couchdb_url : 'http://localhost:5984',

    job:{
        //launch the job every day at 8h30 (the syntax is 'mm hh * * *') see node-schedule (https://www.npmjs.com/package/node-schedule)
        job_time : '0 * * * *',
        xml_file_folder:"XmlVisiteSesam/",
        // xml_file_folder:"/Users/antoine/xmlfiles/",
        number_of_day: 1, //the number of day to keep the document in couchdb after having been given to sora
        dev_job_time : '20 * * * * *', //to remove just for dev purpose
    },

     dev_sql_config:{
        user: 'sa',
        password: 'password1&',
        server: 'localhost',
        database: 'STG_IrisSora'
    },
    sql_config:{
        user: 'sesameTestApp',
        password: '16amTsTApp!',
        server: 'devirissql\\MSSQL_TSTIRIS',
        database: 'DATAWH'
    }
}