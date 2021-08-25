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

router.put('/likes/:id',auth,async(req,res)=>{
    try{

        const post = await userPost.findById(req.params.id)
        if(post.likes.filter(likes=>likes.user.toString()===req.user.id).length>0){
            return res.status(400).json({msg:"Post has been already liked"})
        }
        else{
            post.likes.unshift({user:req.user.id})
            await post.save()
            return res.json(post.likes)
        }
    }
    catch(err){
        console.log(err.message)
        res.status(400).send('Server Problem');
    }
})

router.put('/unlikes/:id',auth,async(req,res)=>{
    try{

        const post = await userPost.findById(req.params.id)
        if(post.likes.filter(likes=>likes.user.toString()===req.user.id).length===0){
            return res.status(400).json({msg:"Post has not been liked"})
        }
        else{
            const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
            post.likes.splice(removeIndex,1)
            await post.save()
            return res.json(post.likes)
        }
    }
    catch(err){
        console.log(err.message)
        res.status(400).send('Server Problem');
    }
})

router.put('/comment/:id',[auth,[
    check('text','Text of Post required').not().isEmpty()
]],async(req,res)=>{
     const errors =  validationResult(req);

    if(!errors.isEmpty()){
        return res.status(500).json({errors:errors.array()});
    }

    try{
        const user = await Users.findById(req.user.id)
        const post = await userPost.findById(req.params.id)
        const newComment = {
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user.id
        }
        post.comments.unshift(newComment)
        await post.save();
        res.send(post)
    }
    catch(err){
        console.log(err.message)
    }
})

router.delete('/comment/:id/:comment_id',auth,async(req,res)=>{

    try{

        const post = await userPost.findById(req.params.id)

        const comment = post.comments.find(comment=>comment.id===req.params.comment_id);
        
        if(!comment)
        {
            return res.status(400).json({msg:"Comment Does not Exist"})
        }
        if(comment.user.toString()!==req.user.id){
            return res.status(400).json({msg:"User not Authorized"})
        }
        console.log(comment.text)
        const removedInd = post.comments.map(comment=>comment.id).indexOf(req.params.comment_id)
        post.comments.splice(removedInd,1)
        await post.save();
        return res.status(400).json(post)

    }
    catch(err){
        consold.log(err.message)
        res.status(500).send('Server Error')

    }
})

module.exports = router