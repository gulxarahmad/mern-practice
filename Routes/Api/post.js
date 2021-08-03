const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
    res.send(' Posts running')
})

module.exports = router