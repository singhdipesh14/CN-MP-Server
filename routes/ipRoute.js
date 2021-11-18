const express = require("express")
const router = express.Router()

const getController = require("../controllers/get")
const postController = require("../controllers/post")

router.route("/").get(getController).post(postController)

module.exports = router
