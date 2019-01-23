const express = require("express");
const multer = require("multer");

const Group = require('../models/group');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();


router.post(
  "",
  checkAuth,
   (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());
    console.log("____________creating group_____________\n"+req.body+"-------------------");
    const group = new Group({
      groupname: req.body.groupname,
      description: req.body.description,
      groupcreator: req.userData.userId,
      username: req.body.username,
      category: req.body.category,
    });
    group.save().then(createdGroup => {

      res.status(201).json({
        message: 'User Created',
        result: createdGroup,
      });
      console.log(group);
    });
  }
);








module.exports = router;
