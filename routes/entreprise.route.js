const router = require('express').Router();
const {getTopEnterpriseBySearch, getEnterpriseById} = require('../controllers/enterprise.controller');

router.get('/search',async (req,res)=> {
    try{
        let ids = await getTopEnterpriseBySearch(req.query.query,req.query.length || 10);
        console.log(req.query)
        res.status(200).json(ids);
    }catch(err){
        console.log(err);
        res.status(400).send("Internal server error.")
    }
})

router.get('/:id',async (req,res)=> {
    try{
        let enterprises = await getEnterpriseById(req.params.id);
        if (enterprises.length == 0){
            res.status(404).send("No enterprise with this id can be found.");
        }else{
            res.status(200).json(enterprises[0]);
        }
    }catch(err){
        console.log(err);
        res.status(400).send("Internal server error.")
    }
})

module.exports = router;