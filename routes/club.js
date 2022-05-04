const express = require("express");
const router = express.Router();
const club_controller = require("../controllers/clubController");

router.get("/", club_controller.index_get);

router.get("/message", club_controller.message_get);

router.post("/message", club_controller.message_post);

router.get("/message/delete", club_controller.message_delete_get);

router.post("/message/delete", club_controller.message_delete_post);

module.exports = router;
