const db = require("../db/connection")

exports.removeCommentById = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])
      .then((result) => {
        if(result.rowCount === 0) {
          return Promise.reject({ msg: "Comment Does Not Exist"})
        }
      })
  };