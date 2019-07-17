const schedule = require('node-schedule');
const config = require('../config');
const {exportVisitesWithInfos} = require('./visiteExport') ;
const {deleteExportedVisites} = require('./deleteDocument');
const logger = require('../logger');


module.exports.registerJob = () =>{
    schedule.scheduleJob(config.job.job_time, async function(){
        try{
            await exportVisitesWithInfos(config.job.xml_file_folder);
            await deleteExportedVisites();
            logger.info('The job finished executing at '+new Date());
        }catch(err){
            logger.error(err);
        }
    });
}