const schedule = require('node-schedule');
const config = require('../config');
const {exportVisitesWithInfos} = require('./visiteExport') ;
const {deleteExportedVisites} = require('./deleteDocument');


module.exports.registerJob = () =>{
    schedule.scheduleJob(config.job.job_time, async function(){
        try{
            await exportVisitesWithInfos(config.job.xml_file_folder);
            await deleteExportedVisites();
            console.log('The job finished executing at '+new Date());
        }catch(err){
            console.log(err);
        }
    });
}