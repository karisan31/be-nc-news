const db = require("../db/connection");

module.exports.fetchArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({ msg: "Article Does Not Exist"})
            }
            return rows[0];
        });
};

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
            return rows;
        });
};

module.exports.fetchCommentsByArticleId = (article_id) => {

    const queryStr = `
        SELECT * FROM comments WHERE comments.article_id = $1
        ORDER BY created_at desc
    `

    return db.query(queryStr, [article_id])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({ msg: "Article Does Not Exist"})
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
          return Promise.reject({ message: "Not Found"})
        }
        return rows[0];
      });
  };