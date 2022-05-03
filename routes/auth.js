const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/club/user/create", authController.user_create_get);

router.post("/club/user/create", authController.user_create_post);

router.get("/club/log-in", authController.user_login_get);

router.post("/club/log-in", authController.user_login_post);

module.exports = router;
