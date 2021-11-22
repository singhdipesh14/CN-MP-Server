var utilFunctions = require('../utils/functions');

const get = (req, res) => {
	// var ip = req.body.ip;
	// var prefixLength = req.body.prefix;
	// var octets = ip.split('.');

	var utilfunction=new utilFunctions('98.165.33.250', 11, [98, 165, 33, 250])

	// console.log(utilfunction.info());

	res.json({ status: 200, msg: "success from get!", info: utilfunction.info()})
}

module.exports = get
