const schedule = require('node-schedule');
const config = require('../config');
const {writeXmlFiles} = require('./visiteExport') ;
const {deleteSynchronizedVisites} = require('./deleteDocument');


module.exports.registerJob = () =>{
    schedule.scheduleJob(config.job.job_time, async function(){
        try{
            await writeXmlFiles(config.job.xml_file_folder);
            await deleteSynchronizedVisites();
            console.log('The job finished executing at '+new Date());
        }catch(err){
            console.log(err);
        }
    });
}