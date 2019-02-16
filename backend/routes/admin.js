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

     if(req.body.password == "starwars123456") {

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



module.exports = router;
