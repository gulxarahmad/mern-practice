const express = require('express')
const dbConnect = require('./Config/db')

const app = express();

const PORT = process.env.PORT || 5000

dbConnect();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('API is running')
})

app.use('/api/users', require('./Routes/Api/users'))
app.use('/api/auth', require('./Routes/Api/auth'))
app.use('/api/profile', require('./Routes/Api/profile'))
app.use('/api/post', require('./Routes/Api/post'))

app.listen(PORT,()=>{
    console.log(`Server is working on ${PORT}`)
})