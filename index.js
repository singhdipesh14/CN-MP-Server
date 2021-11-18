const express = require("express")
const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 3000

const ipRoute = require("./routes/ipRoute")

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
	res.json({ status: 200, msg: "success!" })
	return
})

app.use("/api/v1/ipv4", ipRoute)

app.listen(PORT, () => {
	console.log("Server listening on " + PORT)
})
