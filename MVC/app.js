const express = require('express')
const app = express()


// my different cb functions form controllers
const {getTopics, beOnApi} = require('./controllers')

app.use(express.json())

app.get('/api/topics' , getTopics)
app.get('/api', beOnApi)

app.all('*' ,(req, res)=>{
    res.status(404).send({message : "Error 404! endpoint not found :("})
})


module.exports = app