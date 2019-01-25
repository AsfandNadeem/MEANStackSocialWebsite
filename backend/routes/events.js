const express = require("express");
const multer = require("multer");

const Event = require('../models/event');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();


router.post(
  "",
  checkAuth,
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(url.toString());
    console.log("____________creating event_____________\n"+req.body+"-------------------");
    const event = new Event({
      eventname: req.body.eventname,
      description: req.body.description,
     eventcreator: req.userData.userId,
      eventdate: req.body.eventdate,
      username: req.body.username,
      category: req.body.category,
    });
    event.save().then(createdEvent => {

      res.status(201).json({
        message: 'Event Created',
        result: createdEvent,
      });
      console.log(event);
    });
  }
);








module.exports = router;
