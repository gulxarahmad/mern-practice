const express = require('express');
const gravatar = require('gravatar');
const bkrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')

const {check, validationResult} = require('express-validator/check')

const Users = require('../../Models/User');

const router = express.Router();

router.post('/',[
    check('name','Please Enter a Name')
    .not()
    .isEmpty(),
    check('email','Please Enter a Valid Email')
    .isEmail(),
    check('password','Please Enter Password of 6 or more digits')
    .isLength({min:6})
], async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {name, email, password} = req.body

    try{
        let user = await Users.findOne({email})
        if(user){
            return res.status(400).json({errors:[{msg:'User already exist'}]})
        }

        const avatar = gravatar.url(email,{
            s:'200',
            d:'mm',
            r:'pg'
        })

        const newUser = new Users ({
            name,
            email,
            avatar,
            password
        })

        const salt = await bkrypt.genSalt(10);
        newUser.password = await bkrypt.hash(password,salt)
        await newUser.save()

        const payload = {
            user:{
                id:newUser.id
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