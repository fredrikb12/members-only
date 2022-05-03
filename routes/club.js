const express = require("express");
const router = express.Router();
const club_controller = require("../controllers/clubController");

router.get("/", (req, res, next) => {
  res.render("index", { title: "Home page" });
});

module.exports = router;
