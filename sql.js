const sql = require('mssql');
const config  = require('./config');


let connectSql = async (numberOfRetry = 5) => {
  try{
    try{
      await sql.query("Select * from AGENT_DD");
      return sql;
    }catch(err){
      console.log(err);

      await sql.connect({
        ...config.sql_config,
        requestTimeout : 25000
      });
      return sql;
    }
  }catch(err){
    if (numberOfRetry > 0){
      return await new Promise((res,rej)=> setTimeout( ()=> res(connectSql(numberOfRetry-1)),100));
    }else{
      throw(err)
    }
  }

}

//let closeSql = () => sql.close();
let closeSql = () => undefined;



module.exports = {connectSql, closeSql};