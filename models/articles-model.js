const db = require("../db/connection");

module.exports.fetchArticleById = (article_id, includeCommentCount = false) => {
    const validCommentCountQueries = [false, 'true'];
    if (!validCommentCountQueries.includes(includeCommentCount)) {
        return Promise.reject({ msg: 'Invalid Query' })
    }
    
    const queryStr = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url
        ${includeCommentCount ? ', COUNT(comments.comment_id) AS comment_count': ''}
        FROM articles
        ${includeCommentCount ? 'LEFT JOIN comments ON articles.article_id = comments.article_id' : ''}
        WHERE articles.article_id = $1
        GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url
    `
    
    return db.query(queryStr, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ msg: "Article Does Not Exist" })
            }
            return rows[0];
        });
};

module.exports.fetchArticles = (topic) => {

    let queryStr = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
    `

    const queryParameters = [];

    if (topic) {
        queryStr += ` WHERE topic = $1`;
        queryParameters.push(topic);
    }

    queryStr += ` 
        GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
        ORDER BY created_at desc
    `

    return db.query(queryStr, queryParameters)
        .then(({ rows }) => {
            return rows;
        });
};

module.exports.fetchCommentsByArticleId = (article_id) => {

    const queryStr = `
        SELECT * FROM comments WHERE comments.article_id = $1
        ORDER BY created_at desc
    `

    const checkArticleIdExists = `
        SELECT * FROM articles WHERE article_id = $1
    `

    return db.query(queryStr, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return db.query(checkArticleIdExists, [article_id])
                    .then(({ rows }) => {
                        if (rows.length === 0) {
                            return Promise.reject({ msg: "Article Does Not Exist" })
                        }
                        return [];
                    })
            }
            return rows;
        });
};

module.exports.insertCommentById = (newComment, articleIdOfComment) => {
    const { body, username } = newComment;
    const { article_id } = articleIdOfComment;

    return db
        .query(
            `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, 0, NOW()) RETURNING *`,
            [body, username, article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ msg: "Article Does Not Exist" })
            }
            return rows[0];
        });
};

module.exports.updateArticleById = (newVotes, articleId) => {
    const { inc_votes } = newVotes;
    const { article_id } = articleId;

    return db
        .query(
            `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
            [inc_votes, article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ msg: "Article Does Not Exist" })
            }
            return rows[0];
        });
};