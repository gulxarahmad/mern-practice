const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
    res.send(' Auth running')
})

module.exports = router