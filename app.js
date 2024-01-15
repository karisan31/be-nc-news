const express = require("express");
const { getTopics } = require("./controllers/topics-controller")


const app = express();

app.use(express.json());


app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
    console.log(err)
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
