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
        message: 'Group Created',
        result: createdGroup,
      });
      console.log(group);
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;// like query parmaetres /?abc=1$xyz=2 , + is for converting to numbers
  const currentPage = +req.query.page;

  const groupQuery = Group.find().sort({ '_id': -1 });
  let fetchedGroup;
  if (pageSize && currentPage) {
    groupQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  groupQuery
    .then(documents => {
      fetchedGroup = documents;
      return Group.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Groups fetched successfully!",
        groups: fetchedGroup,
        maxGroups: count
      });
    });
});








module.exports = router;
