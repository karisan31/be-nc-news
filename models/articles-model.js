const db = require("../db/connection");

module.exports.fetchArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({ msg: "Article Does Not Exist"})
            }
            return rows[0];
        })
}

module.exports.fetchArticles = () => {
    
    const queryStr = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
        ORDER BY created_at desc
    `
    
    return db.query(queryStr)
        .then(({ rows }) => {
            console.log(rows)
            return rows;
        })
}