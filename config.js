module.exports = {
    //sql_db_url : 'mssql://sesameTestApp:16amTsTApp!@devirissql\\MSSQL_TSTIRIS/DATAWH',
    couchdb_url : 'http://localhost:5984',
    port: process.env.PORT || 8080,

    job:{
        //launch the job hour (the syntax is 'mm hh * * *') see node-schedule (https://www.npmjs.com/package/node-schedule)
        job_time : '0 * * * *',
        xml_file_folder:"XmlVisiteSesam/",
        number_of_day: 1, //the number of day to keep the document in couchdb after having been given to sora
    },

    dev_sql_config:{
        user: 'sa',
        password: 'password1&',
        server: 'localhost',
        database: 'STG_IrisSora'
    },
    real_sql_config:{
        user: 'sesameTestApp',
        password: '16amTsTApp!',
        server: 'devirissql\\MSSQL_TSTIRIS',
        database: 'DATAWH'
    }
}