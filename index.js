const express = require('express')
const dbConnect = require('./Config/db')

const app = express();

const PORT = process.env.PORT || 5000

dbConnect();


app.get('/',(req,res)=>{
    res.send('API is runningn')
})

app.listen(PORT,()=>{
    console.log(`Server is working on ${PORT}`)
})