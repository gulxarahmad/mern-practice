const express = require('express');
const auth = require('../../Middleware/auth')
const Users = require('../../Models/User')
const userProfile = require('../../Models/Profile')
const {check, validationResult} = require('express-validator/check')

const router = express.Router();

router.get('/me',auth,async(req,res)=>{
    try{
        console.log(req.user.id)
        const profile = await userProfile.findOne({user:req.user.id}).populate('user',
        ['name','avatar'])
        if(!profile){
            return res.status(500).json({msg:'There is no profile exist'})
        }
        return res.json(profile)
    }
    catch(err){

        console.log(err.message);

        return res.status(500).send('Server Problem')
    }
    
})

router.post('/create',[auth,[

    check('status','Pease Update Your Status').not().isEmpty(),
    check('skills','Please Add Your Skills').not().isEmpty()

]],async(req,res)=>{
    const errors =  validationResult(req);

    if(!errors.isEmpty()){
        return res.status(500).json({errors:errors.array()});
    }
    const{
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        linkedin,
        instagram,
        facebook
    } = req.body

    const profileFields = {}
    profileFields.user = req.user.id
    if(company)  profileFields.company = company
    if(website)  profileFields.website = website
    if(location)  profileFields.location = location
    if(status)  profileFields.status = status
    if(bio)  profileFields.bio = bio
    if(githubusername)  profileFields.githubusername = githubusername

    if(skills)  {
        profileFields.skills = skills.split(',').map(skills=>skills.trim())
    }

    profileFields.social = {}
    if(youtube)  profileFields.social.youtube = youtube
    if(twitter)  profileFields.social.twitter = twitter
    if(linkedin)  profileFields.social.linkedin = linkedin
    if(facebook)  profileFields.social.facebook = facebook
    if(instagram)  profileFields.social.instagram = instagram

    try{
        
        let profile = await userProfile.findOne({user:req.user.id});
        if(profile){
            console.log('update part running')
            profile = await userProfile.findOneAndUpdate(
                {user:req.user.id},
                {$set: profileFields},
                {new:true}
                );
                return res.json(profile)
        }
        
            profile = new userProfile(profileFields)
            await profile.save();
            return res.json(profile)
        

      
    }
    catch(err){
        console.log(err.message)
    }

})

router.get('/all-profiles',async(req,res)=>{
    try{
        const profiles = await userProfile.find().populate('user',['name','avatar'])
        return res.json(profiles)
    }
    catch(err){
        return res.send(err.message)
    }
})

router.get('/user/:user_id',async(req,res)=>{
    try{
        const profile = await userProfile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
        if(!profile){
            return res.status(400).send({msg:'Profile does not exist'})
        }
        return res.json(profile)
    }
    catch(err){
     if(err.kind == 'ObjectId')
        {
            return res.status(500).json({msg:'There is no profile exist'})
        }
        return res.send(err.message)
    }
})

router.delete('/',auth, async(req,res)=>{
    try{

        await userProfile.findOneAndDelete({user:req.user.id})
        await Users.findOneAndDelete({_id:req.user.id})
        return res.status(400).json({msg:'User has been deleted'})

    }
    catch(err){
        return res.send('Sever Error')
    }
})

router.put('/add_experience',[auth,[
    check('title','Please Add Title').not().isEmpty(),
    check('company','Please Add company').not().isEmpty(),
    check('from','Please Add Date of Joining').not().isEmpty()
]],async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try{
        console.log(req.body.id)
        const profile = await userProfile.findOne({user:req.user.id})

        
        profile.experience.unshift(newExp)
        await profile.save();
        return res.status(400).json(profile)
    }
    catch(err){
        console.log(err.message)
        return res.status(400).json({msg:'Server Issue'})
    }
})

module.exports = router