const {
    fetchArticleById,
    fetchArticles,
    fetchCommentsByArticleId,
    insertCommentById,
} = require("../models/articles-model");

module.exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id)
        .then((article) => {
        res.status(200).send({ article })      
    })
    .catch((err) => {
        next(err)
    })
};

module.exports.getArticles = (req, res, next) => {
    fetchArticles()
        .then((articles) => {
        res.status(200).send({ articles })      
    })
    .catch((err) => {
        next(err)
    })
};

module.exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    fetchCommentsByArticleId(article_id)
        .then((comments) => {
        res.status(200).send({ comments })      
    })
    .catch((err) => {
        next(err)
    })
};

module.exports.postCommentByArticleId = (req, res, next) => {
    const newComment = req.body;
    const articleId = req.params;

    insertCommentById(newComment, articleId)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err)
        })
};