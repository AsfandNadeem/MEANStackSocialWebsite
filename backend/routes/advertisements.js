
const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const User = require('../models/user');
const Advertiser = require("../models/advertiserModel");
const Advertisement = require("../models/advertisementModel");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },

  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

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
