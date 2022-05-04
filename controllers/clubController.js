const User = require("../models/user");
const Message = require("../models/message");
const async = require("async");
const { body, validationResult } = require("express-validator");
const req = require("express/lib/request");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const luxon = require("luxon");

exports.index_get = function (req, res, next) {
  Message.find()
    .sort({ createdAt: "desc" })
    .populate("author")
    .exec(function (err, results) {
      if (err) return next(err);
      else {
        results.forEach((message) => {
          console.log(message.createdAt);
          message.date = luxon.DateTime.fromMillis(
            message.createdAt
          ).toLocaleString(luxon.DateTime.DATE_MED);
        });
        res.render("index", { title: "Home page", messages: results });
      }
    });
};

exports.message_get = function (req, res, next) {
  if (!req.user) res.redirect("/");
  else {
    res.render("message_form", { title: "Create Message" });
  }
};

exports.message_post = [
  body("title", "Title is required.")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body("text", "Text is required and must be a maximum of 280 characters")
    .trim()
    .isLength({ min: 1, max: 280 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("message_form", {
        title: "Create message",
        msgTitle: req.body.title,
        msgText: req.body.text,
        errors: errors.array(),
      });
    } else {
      const message = new Message({
        title: req.body.title,
        text: req.body.text,
        author: res.locals.currentUser,
      }).save((err) => {
        if (err) return next(err);
        res.redirect("/club");
      });
    }
  },
];

exports.message_delete_post = function (req, res, next) {
  Message.findById(req.body.messageid).exec(function (err, results) {
    if (err) return next(err);
    if (results == null) {
      res.redirect("/club");
      return;
    } else {
      Message.findByIdAndRemove(
        req.body.messageid,
        function deleteMessage(err) {
          if (err) return next(err);
          res.redirect("/club");
        }
      );
    }
  });
};

exports.message_delete_get = function (req, res, next) {
  res.redirect("/");
};
