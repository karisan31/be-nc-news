const endpoints  = require("../endpoints.json");

module.exports.getEndpoints = (req, res) => {
    res.status(200).send(endpoints)      
}