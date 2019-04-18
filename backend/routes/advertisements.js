
const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const User = require('../models/user');
const Advertiser = require("../models/advertiserModel");
const Advertisement = require("../models/advertisementModel");
const cloudinary = require("cloudinary");
require('dotenv').config();
const cloudinaryStorage = require("multer-storage-cloudinary");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "ComsatsSocial",
  allowedFormats: ["jpg", "png"]
});

router.post("/login", (req,res,next) => {
  let fetchedUser;
  Advertiser.findOne({ email: req.body.email })
    .then( user => {
      if ( !user ) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser= user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      res.status(200).json({
        userId: fetchedUser._id,
        username: fetchedUser.username
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "Auth Failed"
      });
    });
});

router.get("/:id", (req, res, next) => {
     const postQuery = Advertisement.find({adcreator: req.params.id}).sort({'_id': -1});
    let fetchedPosts;
    postQuery
      .then(documents => {
        fetchedPosts = documents;
        return Advertisement.count();
      })
      .then(count => {
        console.log(count+"-------------------------\n"+fetchedPosts);
        res.status(200).json({
          message: "adPosts fetched successfully!",
          posts: fetchedPosts,
          maxPosts: count
        });
      });

});

router.post(
  "/advertise/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());
    console.log(req.params.id);

    if(req.file) {
      const post = new Advertisement({
        title: req.body.title,
        content: req.body.content,
        username: req.body.username,
        createdAt: Date.now(),
        adcreator: req.params.id,
        imagePath: req.file.url
      });


      post.save().then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      });
    }
    else {
      const post = new Advertisement({
        title: req.body.title,
        content: req.body.content,
        username: req.body.username,
        createdAt: Date.now(),
        adcreator: req.params.id,
        category: req.body.category
      });

      post.save().then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      });
    }
  }
);

router.post('/signup',
  multer({ storage: storage }).single("image"),
  (req,res,next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());
    console.log(req.body.email);
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
          const advertiser = new Advertiser({
            email: req.body.email,
            password: hash,
            username: req.body.username,
            });

       advertiser.save()
         .then(result => {
           res.status(201).json({
                  message: 'Advertiser Created',
                  result: result,
                });
         });

      });

  });

module.exports = router;
