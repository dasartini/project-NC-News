const { findTopics, fetchArticleId, fetchArticles,
    fetchCommentsByArtId, checkIfArticleExist, postAComment } = require('./models')
const endpoint = require('../endpoints.json')


const getTopics = function (req, res, next) {
    return findTopics().then((topics) => {
        res.status(200).send({ topics })

    })
};

const getApiEndPoints = function (req, res, next) {

    return res.status(200).send({ endpoint })
};

const getArticleById = function (req, res, next) {
    const { article_id } = req.params
    return fetchArticleId(article_id).then((article) => {
        res.status(200).send({ article })

    })
        .catch((err) => {
            next(err)
        })
};

const getAllArticles = function (req, res, next) {
    return fetchArticles().then((articles) => {
        articles.forEach((article) => {
            delete article.body
        })
        res.status(200).send({ articles })

    })
};

const getCommentsByArticleId = function (req, res, next) {
    const { article_id } = req.params

    Promise.all([fetchCommentsByArtId(article_id), checkIfArticleExist(article_id)])

        .then(([comments]) => {
            res.status(200).send({ comments })


        })
        .catch((err) => {
            next(err)
        })

}

const postCommentById = function (req, res, next){
   const {article_id} = req.params
   const {body} = req
   console.log(body.username)
    return postAComment(article_id, body).then((result)=>{
        const newComment = result[0]
        res.status(201).send({newComment})
        
    })

    .catch((err)=>{
        next(err)
    })

}

module.exports = { getTopics, getApiEndPoints, getArticleById, getAllArticles, getCommentsByArticleId , postCommentById}