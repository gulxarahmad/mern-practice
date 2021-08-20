const express = require('express');
const request = require('request');
const config = require('config');
const auth = require('../../Middleware/auth')
const Users = require('../../Models/User')
const userPost = require('../../Models/Post')
const {check, validationResult} = require('express-validator/check')

const router = express.Router();

router.post('/',[auth,[
    check('text','Text of Post required').not().isEmpty()
]],async(req,res)=>{
     const errors =  validationResult(req);

    if(!errors.isEmpty()){
        return res.status(500).json({errors:errors.array()});
    }

    try{
        const user = await Users.findById(req.user.id)
        const newPost = new userPost({
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user.id
    })
        const post = await newPost.save();
        res.send(post)
    }
    catch(err){
        console.log(err.message)
    }
})


router.get('/',auth,async(req,res)=>{

    try{
        const posts = await userPost.find().sort({date:-1})
        res.send(posts)

    }
    catch(err){
        console.log(err.message)
    }
})

router.get('/:id',auth,async(req,res)=>{

    try{
        const post = await userPost.findById(req.params.id).sort({date:-1})
        if(!post){
            res.send('Oppps, POST has not found!!!')
        }
        else{
            res.send(post)
        }

    }
    catch(err){
        console.log(err.message)
        if(err.kind == 'ObjectId')
        {
            return res.status(500).json({msg:'Oppps, POST has not found!!!'})
        }
    }
})

router.delete('/:id',auth,async(req,res)=>{

    try{
        const post = await userPost.findByIdAndDelete(req.params.id).sort({date:-1})
        res.send('Post has been deleted')

    }
    catch(err){
        console.log(err.message)
        if(err.kind == 'ObjectId')
        {
            return res.status(500).json({msg:'Oppps, POST has not found!!!'})
        }
    }
})

module.exports = router