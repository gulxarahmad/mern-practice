const mongoose = require('mongoose');

const User = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    avatar:{
        type:String
    },
    Date:{
        type:Date,
        default:Date.now
    }
})

module.exports = Users = mongoose.model('users', User)