const express = require('express');
const auth = require('../../Middleware/auth')
const Users = require('../../Models/User')
const {check, validationResult} = require('express-validator/check')
const bkrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')

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

router.post('/',[

    check('email','Please Enter a Valid Email')
    .isEmail(),
    check('password','Please Enter Password of 6 or more digits')
    .exists()
], async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const { email, password} = req.body

    try{
        let user = await Users.findOne({email})
        if(!user){
            return res.status(400).json({errors:[{msg:'Email Does Not Exist'}]})
        }

        const isMatch = await bkrypt.compare(password, user.password)
        if(!isMatch){
          return res.status(400).json({errors:[{msg:'Your Password is Wrong'}]})
        }

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:3600000},
            (err,token)=>{
            if(err) throw err;
            res.json({token});
            }
        )
       // return res.status(200).send('Hurray you are registered')
    }
    catch(err){
        console.log(err.message);
        return res.status(500).send('Server is causing problem')
    }
})

module.exports = router