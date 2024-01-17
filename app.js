const express = require("express");
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const {
    getArticleById,
    getArticles,
    getCommentsByArticleId,
    postCommentByArticleId,
    patchArticleById,
} = require("./controllers/articles-controller");
const { deleteCommentById } = require("./controllers/comments-controller");

const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
} = require("./errors/index");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app;
