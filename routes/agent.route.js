const router = require('express').Router();
const { getUserById} = require('../controllers/user.controller');


router.get('/:id',async (req,res)=> {
    try{
        let enterprises = await getUserById(req.params.id);
        if (enterprises.length == 0){
            res.status(404).send("No enterprise with this id can be found.");
        }else{
            res.status(200).json(enterprises[0]);
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err)
    }
})

module.exports = router;