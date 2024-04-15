const { findTopics, fetchArticleId } = require('./models')
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
   //console.log(article_id)
    return fetchArticleId(article_id).then((article) => {
        console.log({ article })
        res.status(200).send({ article })

    })
    .catch((err)=>{
        console.log(err)
        next(err)
    })
};

module.exports = { getTopics, getApiEndPoints, getArticleById }