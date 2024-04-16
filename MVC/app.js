const express = require('express')
const app = express()
const {getTopics, getApiEndPoints, getArticleById, getAllArticles} = require('./controllers')

app.use(express.json())

app.get('/api/topics' , getTopics)
app.get('/api', getApiEndPoints)
app.get('/api/articles/:article_id', getArticleById )
app.get('/api/articles', getAllArticles)

app.use((err, req, res, next) => {
    if (err.status && err.message ) {
      res.status(err.status).send({ message: err.message });
    } 
    else next(err);
  });

app.use( (err, req, res, next)=>{
    if(err.code === "22P02"){
        res.status(400).send({message : "Bad request :("})
    }
    else next(err)
})


app.all('*' ,(req, res)=>{
    res.status(404).send({message : "Error 404! endpoint not found :("})
})


module.exports = app