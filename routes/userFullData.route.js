const router = require('express').Router();
const  getDataByUserId = require('../controllers/fulldata.controller');

router.get('/:table/:idAgent',async (req,res)=> {
    try{
        let data = await getDataByUserId(req.params.table,req.params.idAgent);
        res.json(data);
    }catch(err){
        console.log(err);
        res.status(400).send(err)
    }
})

module.exports = router;