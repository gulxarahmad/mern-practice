const express = require('express');
const auth = require('../../Middleware/auth')
const Users = require('../../Models/User')

const router = express.Router();

router.get('/',auth,async(req,res)=>{
  //  res.send(' Auth running')

    try{
        const users = await Users.findById(req.user.id).select('-password')
       res.json(users)
       
    }
    catch(err){
        console.log(err.message)
        return res.status(400).send('Server problem')
    }
})

module.exports = router