var utilFunctions = require("../utils/functions")

const get = (req, res) => {
	console.log(req)
	res.json({ status: 200, msg: "success from post!", body: req.body })
}

module.exports = get
