const express = require("express");
const router = express.Router();

//Middleware:
router.use(function timelog(req, res, next) {
    next();
	//console.log("Time: ", Date.now());
});

router.get("/", async (req, res) => {
	res.send({ info: "Hey Guys!!" });
});

module.exports = router;
