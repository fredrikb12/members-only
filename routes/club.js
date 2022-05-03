const express = require("express");
const router = express.Router();

const club_controller = require("../controllers/clubController");

/* GET home page. */

router.get("/", (req, res, next) => {
  res.send("NOT IMPLEMENTED: /club page GET")
})
router.get("/user/create", club_controller.user_create_get);

router.post("/user/create", club_controller.user_create_post);

module.exports = router;
