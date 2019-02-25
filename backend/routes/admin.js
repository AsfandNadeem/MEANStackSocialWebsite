const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");

const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require('../models/user');
const Group = require('../models/group');
const Event = require('../models/event');

const router = express.Router();

router.post(
  "/login",
  (req, res, next) => {
   if(req.body.email == "asfandmoeez123") {

     if(req.body.password == "starwars") {

       res.status(200).json({
         message: "admin logged"
       });

     } else {
       return res.status(401).json({
         message: "admin failed"
       });
     }

   } else {
     return res.status(401).json({
       message: "admin failed"
     });
   }
  });

router.get("/users", (req, res, next) => {

  const userQuery = User.find().sort({ '_id': -1 });
  let fetchedUsers;


  userQuery
    .then(documents => {
      fetchedUsers = documents;
      return User.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        users: fetchedUsers,
        maxUsers: count
      });
    });
});

router.get("/groups", (req, res, next) => {

  const groupQuery = Group.find().sort({ '_id': -1 });
  let fetchedGroups;

  groupQuery
    .then(documents => {
      fetchedGroups = documents;
      return Group.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        groups: fetchedGroups,
        maxGroups: count
      });
    });
});

router.get("/events", (req, res, next) => {

  const eventQuery = Event.find().sort({ '_id': -1 });
  let fetchedEvents;

  eventQuery
    .then(documents => {
      fetchedEvents = documents;
      return Event.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        events: fetchedEvents,
        maxEvents: count
      });
    });
});


router.get("/posts", (req, res, next) => {

  const postQuery = Post.find().sort({ '_id': -1 });
  let fetchedPosts;

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});
module.exports = router;
