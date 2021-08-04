const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next){
    const token = req.header('x-head-token');
    if(!token){
        return res.status(401).json({msg:'Token not available for authentication'})
    }

    try{
        const decode = jwt.verify(token, config.get('jwtSecret'));
        req.user = decode.user
        next();
    }
    catch(err){
        return res.status(401).json({msg:'Token not available for authentication'})
    }
    
}