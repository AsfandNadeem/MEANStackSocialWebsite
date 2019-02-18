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
  // const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  // const currentPage = +req.query.page;

  const userQuery = User.find().sort({ '_id': -1 });
  let fetchedUsers;
  // if (pageSize && currentPage) {
  //   postQuery
  //     .skip(pageSize * (currentPage - 1))
  //     .limit(pageSize);
  // }

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



module.exports = router;
