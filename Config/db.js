const mongoose = require('mongoose');
const config = require('config');

const db = config.get('MongoURI');

function dbConnect (){
    try{
        mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB is conncted')
       
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports = dbConnect;