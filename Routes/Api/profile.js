const express = require('express');
const auth = require('../../Middleware/auth')
const Users = require('../../Models/User')
const userProfile = require('../../Models/Profile')
const {check, validationResult} = require('express-validator/check')

const router = express.Router();

router.get('/me',auth,async(req,res)=>{
    try{
        const profile = await userProfile.findOne({user:req.user.id}).populate('users',
        ['name','avatar'])
        if(!profile){
            return res.status(500).json({msg:'There is no profile exist'})
        }
        res.json(profile)
    }
    catch(err){
        console.log(err.message);
        res.status(500).send('Server Problem')
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
                )
                res.json(profile)
        }
        
            profile = new userProfile(profileFields)
            await profile.save();
            res.json(profile)
        

      
    }
    catch(err){
        console.log(err.message)
    }

})

module.exports = router