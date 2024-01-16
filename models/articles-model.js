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