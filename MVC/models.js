const db = require('../db/connection')

function findTopics() {
    return db.query(`
SELECT * FROM topics`).then(({ rows }) => {
        return rows
    })
};

function fetchArticleId(article_id) {

    return db.query(`SELECT articles.*,
    COUNT (comments.article_id)::int AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) { return Promise.reject({ status: 404, message: "The id provided does not exist!" }) }
            return rows[0]
        })
}

function fetchArticles(topic, sort_by = "created_at", sort_dir = "DESC") {
    const validSort = ['votes', topic, "created_at", "comment_count",]
    const validSortDir = ['ASC', 'DESC']

    if (!validSort.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'Invalid query value' })
    }

    if (!validSortDir.includes(sort_dir)) {
        return Promise.reject({ status: 400, message: 'Invalid query value' })
    }


    let sqlQuery = `
SELECT articles.*,
COUNT (comments.article_id)::int
AS comment_count
FROM articles LEFT JOIN comments 
ON articles.article_id = comments.article_id`

    let query2 = ` GROUP BY articles.article_id
 ORDER BY ${sort_by} ${sort_dir}`
    const queryValues = []

    if (topic) {
        sqlQuery += ` WHERE topic=$1`
        queryValues.push(topic)
    }
    sqlQuery += query2

    return db.query(sqlQuery, queryValues).then(({ rows }) => {
        if (rows.length === 0) { return Promise.reject({ status: 400, message: "Bad request :(" }) }

        return rows
    })
};

function checkQuery(topic) {
    if (topic) {
        return db.query(`SELECT * FROM topics WHERE slug=$1`, [topic])
            .then(({ rows }) => {
                if (rows.length === 0) { return Promise.reject({ status: 400, message: "Bad request :(" }) }
            })

    }
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

module.exports = { findTopics, fetchArticleId, fetchArticles, fetchCommentsByArtId, checkIfArticleExist, postAComment, votes, deleteComment, getUsers, checkQuery }

