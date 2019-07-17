const router = require('express').Router();
const { getUserById} = require('../controllers/user.controller');
const logger = require('../logger');


router.get('/:id',async (req,res)=> {
    try{
        let agents = await getUserById(req.params.id);
        if (agents.length == 0){
            res.status(404).send("No agent with this id can be found.");
        }else{
            res.status(200).json(agents[0]);
        }
    }catch(err){
        logger.error(err);
        res.status(500).send(err)
    }
})

module.exports = router;