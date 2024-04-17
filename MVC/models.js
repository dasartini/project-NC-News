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
            if (rows.length === 0) { return Promise.reject({ status: 404, message: "The id provided does not exist!" }) }
            return rows[0]
        })
}

function fetchArticles() {
    return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.article_id)::int
    AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    )
        .then(({ rows }) => {
            return rows
        })
}

function fetchCommentsByArtId(article_id) {
    return db.query(`
    SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC; `, [article_id])
        .then(({ rows }) => {
            return rows
        })

};

function checkIfArticleExist(article_id) {
    return db.query(`SELECT* FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, message: "The id provided does not exist!" })
            }
        })
}

function postAComment(article_id, body){
    return db.query(`
    INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *`, [article_id, body.body ,body.username])
    .then(({rows})=>{return rows})

}

function votes(article_id, inc_votes){
    return db.query(`UPDATE articles SET votes=$1 WHERE article_id =$2 RETURNING *;`, [inc_votes , article_id])
}

module.exports = { findTopics, fetchArticleId, fetchArticles, fetchCommentsByArtId, checkIfArticleExist, postAComment, votes }

