const get = (req, res) => {
	res.json({ status: 200, msg: "success from get!" })
}

module.exports = get
