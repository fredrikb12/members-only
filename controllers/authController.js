const User = require("../models/user");
const Message = require("../models/message");
const async = require("async");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { removeListener } = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();

exports.user_create_get = function (req, res, next) {
  if (req.user) {
    res.redirect("/");
  }
  res.render("user_form", {
    title: "Create User",
    user: req.user || null,
  });
};

exports.user_create_post = [
  body("first_name", "First name must be between 3 and 30 characters long.")
    .trim()
    .isLength({ min: 3, max: 30 })
    .escape(),
  body("last_name", "Last name must be between 3 and 30 characters long.")
    .trim()
    .isLength({ min: 3, max: 30 })
    .escape(),
  body("username", "Email must be valid")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false }),
  body("password", "Password must be at least 5 characters long")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("password_confirm", "Passwords must match")
    .exists()
    .trim()
    .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("user_form", {
        title: "Create User",
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        errors: errors.array({ onlyFirstError: true }),
      });
      return;
    } else {
      User.findOne({ username: req.body.username }).exec(function (
        err,
        results
      ) {
        if (err) {
          return next(err);
        } else if (results !== null) {
          res.render("user_form", {
            title: "Create User",
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            errors: [{msg: "Email already in use."}],
          });
          return;
        } else {
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) return next(err);
            const user = new User({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              username: req.body.username,
              password: hashedPassword,
              user_type: "user",
            }).save((err) => {
              if (err) return next(err);
              res.redirect("/club");
            });
          });
        }
      });
    }
  },
];

exports.user_login_get = function (req, res, next) {
  res.render("user_login", { title: "Log In" });
};

exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/club",
  failureRedirect: "/log-in",
  failureMessage: true,
});

exports.user_logout_post = function (req, res, next) {
  req.logout();
  res.redirect("/");
};

exports.user_promote_get = function (req, res, next) {
  if (req.user) {
    res.render("user_promote", {
      title: "Promote user",
    });
  } else {
    res.redirect("/club/log-in");
  }
};

exports.user_promote_post = [
  body("secret", "Incorrect secret password").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("user_promote", {
        title: "Promote user",
        errors: errors.array(),
      });
      return;
    } else {
      if (req.body.secret === process.env.MEMBER_SECRET) {
        User.findByIdAndUpdate(req.user._id, { user_type: "member" }).exec(
          function (err, results) {
            if (err) return next(err);
            res.redirect("/");
            return;
          }
        );
      } else if (req.body.secret === process.env.ADMIN_SECRET) {
        User.findByIdAndUpdate(req.user._id, {
          user_type: "member",
          admin: true,
        }).exec(function (err, results) {
          if (err) return next(err);
          res.redirect("/");
          return;
        });
      } else {
        res.render("user_promote", {
          title: "Promote user",
          errors: ["Incorrect secret password"],
        });
      }
    }
  },
];
