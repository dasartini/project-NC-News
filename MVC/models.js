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

function fetchArticles(topic) {
let sqlQuery = `
SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
COUNT (comments.article_id)::int
AS comment_count
FROM articles LEFT JOIN comments 
ON articles.article_id = comments.article_id`

 let query2 =` GROUP BY articles.article_id
 ORDER BY articles.created_at DESC`

const queryValues= []

if(topic){
    sqlQuery+= ` WHERE topic=$1`
    queryValues.push(topic)
}
sqlQuery += query2

return db.query(sqlQuery, queryValues).then(({rows})=>{
    console.log(rows)
    return rows
})

//     return db.query(`
//     SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
//     COUNT (comments.article_id)::int
//     AS comment_count
//     FROM articles
//     LEFT JOIN comments 
//     ON articles.article_id = comments.article_id
//     GROUP BY articles.article_id
//     ORDER BY articles.created_at DESC;`
//     ).then((table)=>{
//         if(topic){return db.query(`SELECT * FROM articles WHERE topic=$1`, [topic])}
        
//     })
//         .then(({ rows }) => {
//             console.log({rows})
//             return rows
//         })
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

function postAComment(article_id, body) {
    return db.query(`
    INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *`, [article_id, body.body, body.username])
        .then(({ rows }) => { return rows })

}

function votes(article_id, inc_votes) {
    return db.query(`UPDATE articles SET votes= votes + $1 WHERE article_id =$2 RETURNING *;`, [inc_votes, article_id])
}

function deleteComment(comment_id) {

    return db.query(`DELETE FROM comments WHERE comment_id =$1 RETURNING *`, [comment_id])
        .then(({ rows }) => {
            if (rows.length === 0) { return Promise.reject({ status: 404, message: "The id provided does not exist!" }) }
            else return rows
        })

}

function getUsers() {

    return db.query(`
    SELECT * FROM users`).then(({ rows }) => {
        return rows
    });
};

module.exports = { findTopics, fetchArticleId, fetchArticles, fetchCommentsByArtId, checkIfArticleExist, postAComment, votes, deleteComment, getUsers }

