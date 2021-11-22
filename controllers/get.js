var utilFunctions = require('../utils/functions');

const get = (req, res) => {
	var ip = req.body.ip || '98.165.33.250';
	var prefixLength = req.body.prefix || 24;
	var octets = ip.split('.');

	var utilfunction=new utilFunctions(ip, prefixLength, octets)

	res.json({ status: 200, msg: "success from get!", info: utilfunction.info()})
}

module.exports = get
