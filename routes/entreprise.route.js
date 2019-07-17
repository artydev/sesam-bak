const router = require('express').Router();
const {getTopEnterpriseBySearch, getEnterpriseById,getVisitesByEntreprise} = require('../controllers/enterprise.controller');
const logger = require('../logger');

router.get('/search',async (req,res)=> {
    try{
        let ids = await getTopEnterpriseBySearch(req.query.query,req.query.length || 10);
        res.status(200).json(ids);
    }catch(err){
        console.log(err);
        res.status(500).send(err)
    }
})

router.get('/:id',async (req,res)=> {
    try{
        let enterprises =  getEnterpriseById(req.params.id);
        let visites =  getVisitesByEntreprise(req.params.id);
        [visites, enterprises] = await Promise.all([visites,enterprises])
        if (enterprises.length == 0){
            res.status(404).send("No enterprise with this id can be found.");
        }else{
            res.status(200).json({...enterprises[0], visites});
        }
    }catch(err){
        logger.error(err);
        res.status(500).send(err)
    }
})

module.exports = router;