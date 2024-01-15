const express = require("express");
const { getTopics } = require("./controllers/topics-controller")
const { getEndpoints } = require("./controllers/endpoints-controller")
const { getArticleById } = require("./controllers/articles-controller")

const app = express();

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
    if (err.msg === 'Route Not Found') {
        res.status(404).send({ msg: 'Route Not Found' })
    }
    else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" })
})

module.exports = app;
