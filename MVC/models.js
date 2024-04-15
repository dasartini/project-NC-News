const db = require('../db/connection')

function findTopics() {
    return db.query(`
SELECT * FROM topics`).then(({ rows }) => {
        return rows
    })
};

function fetchArticleId(article_id) {

    return db.query(`
SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then(({ rows }) => {
            //console.log(rows.length)
            if(rows.length ===0){  return Promise.reject({status: 400, message: "The id provided does not exist!"})}
            return rows[0]
        })
}


module.exports = { findTopics, fetchArticleId }