const router = require('express').Router();
const  getDataByUserId = require('../controllers/fulldata.controller');

router.get('/:table',async (req,res)=> {
    try{
        let data = await getDataByUserId(req.params.table,req.query.idAgent);
        res.json(data);
    }catch(err){
        console.log(err);
        res.status(500).send(err)
    }
})

module.exports = router;