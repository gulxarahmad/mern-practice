const mongoose = require('mongoose');

const Post = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    text:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    avatar:{
        type:String
    },
    likes:[
        {
        user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
            },
        }
    ],
    comments:[
        {
        user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
        },

        text:{
            type:String,
            required:true
        },
        avatar:{
            type:String
        },
        date:{
            type:Date,
            default:Date.now
        }

        }
    ]
})

module.exports = userPost = mongoose.model('post', Post)