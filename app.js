const express = require('express')
const app = express()
const { getTopics, getApiEndPoints, getArticleById, getAllArticles,
  getCommentsByArticleId, postCommentById, patchArticleById,
  deleteCommentById, getAllUsers } = require('./MVC/controllers')

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api', getApiEndPoints)
app.get('/api/users/', getAllUsers)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.delete('/api/comments/:comment_id', deleteCommentById)
app.post('/api/articles/:article_id/comments', postCommentById)
app.patch('/api/articles/:article_id', patchArticleById)


app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  else next(err);
});

app.use((err, req, res, next) => {

  if (err.code === "23503" && err.constraint === "comments_author_fkey") {
    res.status(404).send({ message: "The username attempting to post does not exist!" })
  }
  if (err.code === "23503") {
    res.status(404).send({ message: "The article id attempting to post in does not exist!" })
  }
  else next(err)
})

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request :(" })
  }
  else next(err)
})


app.all('*', (req, res) => {
  res.status(404).send({ message: "Error 404! endpoint not found :(" })
})


module.exports = app