const express = require("express");
const { getTopics } = require("./controllers/topics-controller")
const { getEndpoints } = require("./controllers/endpoints-controller")
const { getArticleById, getArticles } = require("./controllers/articles-controller")

const app = express();

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles)

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' })
    }
    else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.msg === "Article Does Not Exist") {
        res.status(404).send({ msg: err.msg })
    }
    else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" })
})

module.exports = app;
